import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { shared } from "..";

export namespace abi {

	export class Decoded_atomicize_Result {
		method: string
		addressList: Array<string>
		transfers: Array<Decoded_TransferFrom_Result>
		constructor(
			_method: string,
			_addressList: Array<string>,
			_transfers: Array<Decoded_TransferFrom_Result>,
		) {
			this.method = _method
			this.addressList = _addressList
			this.transfers = _transfers
		}
	}

	export class Decoded_TransferFrom_Result {
		method: string
		from: Address
		to: Address
		token: BigInt
		constructor(
			_method: string,
			_from: Address,
			_to: Address,
			_token: BigInt,
		) {
			this.method = _method
			this.from = _from
			this.to = _to
			this.token = _token
		}

		public toStringArray(): string[] {
			return [this.method, this.from.toHexString(), this.to.toHexString(), this.token.toString()]
		}

		/*
		* toString method to be used for debbuging only
		*/
		public toString(): string {
			return this.toLogFormattedString()
		}

		public toLogFormattedString(): string {
			return "\n · · · · · · method( " + this.method + " )\n · · · · · · from( " + this.from.toHexString() + " ) \n · · · · · · to( " + this.to.toHexString() + " )\n · · · · · · id( " + this.token.toString() + " ) "
		}
	}

	export function decodeBatchNftData(
		buyCallData: Bytes, sellCallData: Bytes, replacementPattern: Bytes
	): Decoded_atomicize_Result {
		/**
		 * 
		 * atomicize(address[],uint256[],uint256[],bytes)
		 * 
		 * The calldata input is formated as:
		 * Format =>  0x | METHOD_ID (atomicize)  |   ?   | NB_TOKEN | ADDRESS_LIST
		 * Size   =>  W  |           X            | Y * 4 |     Y    |    Y * Z
		 * ... continues ...
		 * Format => ... |  METADATA_AND_PARAMS_CHUNKS | TRANSFERS_CALLDATA  
		 * Size   => ... |    ( ( M + P ) * 2 ) + P    |        T * Z       
		 * 
		 *      Where :
		 * 	
		 * 			- W = 16 bits (2 hex chars)
		 *          - X = 32 bits (8 hex chars)
		 *          - Y = 256 bits (64 hex chars)
		 *          - Z = value stored in "NB_TOKEN" section (amount of transfers),
		 * 					each address has a "Y" length
		 * 			- M = Metadata chunk of length "Y"
		 * 			- P = Params chunk of length "Y * Z"
		 * 			- T = "TransferFrom" call data of length X + (Y * 3)
		 * 
		 */

		let mergedCallData = guardedArrayReplace(buyCallData, sellCallData, replacementPattern)
		return decodeAbi_Atomicize_Method(mergedCallData)
	}

	function decodeAbi_Atomicize_Method(callData: string,): Decoded_atomicize_Result {
		const TRAILING_0x = 2
		const METHOD_ID_LENGTH = 8
		const UINT_256_LENGTH = 64

		let indexStartNbToken = TRAILING_0x + METHOD_ID_LENGTH + UINT_256_LENGTH * 4;
		let indexStopNbToken = indexStartNbToken + UINT_256_LENGTH;
		let nbTokenStr = callData.substring(indexStartNbToken, indexStopNbToken);

		let nbToken = shared.helpers.hexToBigInt(nbTokenStr).toI32()
		let addressList = new Array<string>();

		// Get the associated NFT contracts
		let offset = indexStopNbToken;
		for (let i = 0; i < nbToken; i++) {
			let addrs = callData.substring(offset, offset + UINT_256_LENGTH);
			addressList.push(addrs);

			// Move forward in the call data
			offset += UINT_256_LENGTH;
		}

		const METADATA_AND_PARAMS_CHUNK_LENGTH = UINT_256_LENGTH + nbToken * UINT_256_LENGTH
		const CHUNKS_SECTION = METADATA_AND_PARAMS_CHUNK_LENGTH * 2 + UINT_256_LENGTH
		offset += CHUNKS_SECTION

		// Get the "TransferFrom" method calls
		const TRANSFER_CALL_DATA_LENGTH = METHOD_ID_LENGTH + UINT_256_LENGTH * 3;

		let transfersList = new Array<Decoded_TransferFrom_Result>()

		for (let i = 0; i < nbToken; i++) {
			let transferFromData = callData.substring(offset, offset + TRANSFER_CALL_DATA_LENGTH);
			let decoded = decodeAbi_transferFrom_Method(transferFromData, false)
			transfersList.push(decoded);

			// Move forward in the call data
			offset += TRANSFER_CALL_DATA_LENGTH;
		}

		let methodId = callData.substring(TRAILING_0x, TRAILING_0x + METHOD_ID_LENGTH);

		return new Decoded_atomicize_Result(
			methodId,
			addressList,
			transfersList
		)
	}

	// TODO: return a typed map
	export function decodeSingleNftData(
		buyCallData: Bytes, sellCallData: Bytes, replacementPattern: Bytes
	): Decoded_TransferFrom_Result {
		/**
		 * 
		 * transferFrom(address,address,uint256)
		 * 
		 * The calldata input is formated as:
		 * Format =>  0x | METHOD_ID (transferFrom) | FROM | TO | TOKEN_ID
		 * Size   =>  W  |            X             |   Y  |  Y |    Y
		 *      Where :
		 * 			- W = 16 bits (2 hex chars) | 0 
		 *          - X = 32 bits (8 hex chars)
		 *          - Y = 256 bits (64 hex chars)
		 * 
		 * 
		 */

		let mergedCallData = guardedArrayReplace(buyCallData, sellCallData, replacementPattern)
		return decodeAbi_transferFrom_Method(mergedCallData)

	}

	export function decodeAbi_transferFrom_Method(callData: Bytes): Decoded_TransferFrom_Result {
		let dataWithoutFunctionSelector = Bytes.fromUint8Array(callData.subarray(4))
		let decoded = ethereum.decode(
			"(address,address,uint256)", dataWithoutFunctionSelector
		)!.toTuple()

		let functionSelector = Bytes.fromUint8Array(callData.subarray(0, 4)).toHex().slice(2)
		let senderAddress = decoded[0].toAddress()
		let recieverAddress = decoded[1].toAddress()
		let tokenId = decoded[2].toBigInt()

		return new Decoded_TransferFrom_Result(
			functionSelector,
			senderAddress,
			recieverAddress,
			tokenId
		)
	}

	export function guardedArrayReplace(_array: Bytes, _replacement: Bytes, _mask: Bytes): Bytes {

		// copies Bytes Array to avoid buffer overwrite
		let array = Bytes.fromUint8Array(_array.slice(0))
		let replacement = Bytes.fromUint8Array(_replacement.slice(0))
		let mask = Bytes.fromUint8Array(_mask.slice(0))

		array.reverse();
		replacement.reverse();
		mask.reverse();

		let bigIntgArray = BigInt.fromUnsignedBytes(array);
		let bigIntReplacement = BigInt.fromUnsignedBytes(replacement);
		let bigIntMask = BigInt.fromUnsignedBytes(mask);

		// array |= replacement & mask;
		bigIntReplacement = bigIntReplacement.bitAnd(bigIntMask);
		bigIntgArray = bigIntgArray.bitOr(bigIntReplacement);
		return changetype<Bytes>(Bytes.fromBigInt(bigIntgArray).reverse());

	}
}