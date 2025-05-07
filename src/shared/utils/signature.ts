import forge from 'node-forge';

const PRIVATE_KEY = import.meta.env.VITE_RSA_PRIVATE_KEY as string;
const PUBLIC_KEY = import.meta.env.VITE_RSA_PUBLIC_KEY as string;
const PASSPHRASE = import.meta.env.VITE_RSA_PASSPHRASE as string | undefined;

if (!PRIVATE_KEY || !PUBLIC_KEY) {
  throw new Error('RSA keys are not configured in .env');
}

export const signData = (data: string): string => {
  let privateKey;
  try {
    console.log(
      'Attempting to load private key with passphrase:',
      !!PASSPHRASE
    );
    privateKey = PASSPHRASE
      ? forge.pki.decryptRsaPrivateKey(PRIVATE_KEY, PASSPHRASE)
      : forge.pki.privateKeyFromPem(PRIVATE_KEY);
  } catch (err) {
    console.error('Failed to load private key:', err);
    if (err instanceof Error) {
      throw new Error(`Не удалось загрузить приватный ключ: ${err.message}`);
    } else {
      throw new Error('Неизвестная ошибка при загрузке приватного ключа.');
    }
  }

  if (!privateKey) {
    throw new Error(
      'Не удалось расшифровать приватный ключ. Проверьте passphrase и формат ключа.'
    );
  }

  const md = forge.md.sha1.create();
  md.update(data, 'utf8');
  const signature = privateKey.sign(md);
  return forge.util.bytesToHex(signature).toUpperCase();
};

export const verifySignature = (
  data: string,
  signatureHex: string
): boolean => {
  try {
    const publicKey = forge.pki.publicKeyFromPem(PUBLIC_KEY);
    const md = forge.md.sha1.create();
    md.update(data, 'utf8');
    const signature = forge.util.hexToBytes(signatureHex.toLowerCase());
    return publicKey.verify(md.digest().bytes(), signature);
  } catch (err) {
    console.error('Ошибка проверки подписи:', err);
    return false;
  }
};

export const createRequestSignatureString = (
  params: Record<string, string>
): string => {
  return Object.values(params)
    .map((value) => String(value).replace(/"/g, ''))
    .join('');
};

export const createResponseSignatureString = (response: any): string => {
  const { session_id, operation_name, status, result, error } = response;
  let resultStr = '';
  if (result) {
    if (result.auth_code !== undefined) {
      resultStr = `${result.auth_code}${result.token_sms || ''}`;
    } else if (result.sms_status !== undefined) {
      resultStr = `${result.sms_status}`;
    } else if (result.sms_check !== undefined) {
      resultStr = `${result.sms_check}`;
    }
  }
  return `${session_id}${operation_name}${status ? 'true' : 'false'}${resultStr}${error}`;
};
