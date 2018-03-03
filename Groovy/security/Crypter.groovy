package com.smilegames.holy.util

import javax.crypto.Cipher
import javax.crypto.spec.IvParameterSpec
import javax.crypto.spec.SecretKeySpec
import java.security.Key
import java.security.MessageDigest

/**
 * Created by fengyoutian on 2017/4/27.
 */
class Crypter {

	/**
	 * Generate md5 hash as a 32 char String for 'obj'
	 * 'obj' can be a File, InputStream or URL
	 *
	 * @param obj
	 * @return
	 */
	static def md5(obj) {
		def hash = MessageDigest.getInstance('MD5').with {
			obj.eachByte(8192, { bfr, num ->
				update bfr, 0, num
			})
			it.digest()
		}
		new BigInteger(1, hash).toString(16).padLeft(32, '0')
	}

	/**
	 * 生成一个32位的字符串
	 *
	 * @param str
	 * @return
	 */
	static def md5(String str) {
		def hash = MessageDigest.getInstance('MD5').with {
			update(str.bytes)
			digest()
		}
		new BigInteger(1, hash).toString(16).padLeft(32, '0')
	}

	/**
	 * encrypt
	 *
	 * @param plainText
	 * @param secret
	 * @return
	 */
	static byte[] encrypt(String plainText, String secret) {
		byte[] secretDecrypt4Base64 = secret.decodeBase64()

		def cipher = Cipher.getInstance('AES/CBC/PKCS5Padding', 'SunJCE')
		Key key = new SecretKeySpec(secretDecrypt4Base64, 'AES')
		cipher.init(Cipher.ENCRYPT_MODE, key, new IvParameterSpec(secretDecrypt4Base64))

		return cipher.doFinal(plainText.getBytes('UTF-8'))
	}

	/**
	 * decrypt
	 *
	 * @param cypherBytes
	 * @param secret
	 * @return
	 */
	static def decrypt(byte[] cypherBytes, String secret) {
		byte[] secretDecrypt4Base64 = secret.decodeBase64()

		def cipher = Cipher.getInstance('AES/CBC/PKCS5Padding', 'SunJCE')
		Key key = new SecretKeySpec(secretDecrypt4Base64, 'AES')
		cipher.init(Cipher.DECRYPT_MODE, key, new IvParameterSpec(secretDecrypt4Base64))

		return new String(cipher.doFinal(cypherBytes), 'UTF-8')
	}

	/**
	 * encrypt to Base64
	 *
	 * @param plainText
	 * @param secret
	 * @return
	 */
	static def encryptBase64(String plainText, String secret) {
		return encrypt(plainText, secret).encodeBase64().toString()
	}

	/**
	 * decrypt to Base64
	 *
	 * @param cypherText
	 * @param secret
	 * @return
	 */
	static def decryptBase64(String cypherText, String secret) {
		return decrypt(cypherText.decodeBase64(), secret)
	}

	/**
	 * encrypt to Hex
	 *
	 * @param plainText
	 * @param secret
	 * @return
	 */
	static def encryptHex(String plainText, String secret) {
		return encrypt(plainText, secret).encodeHex().toString()
	}

	/**
	 * decrypt to Base64
	 *
	 * @param cypherText
	 * @param secret
	 * @return
	 */
	static def decryptHex(String cypherText, String secret) {
		return decrypt(cypherText.decodeHex(), secret)
	}
}
