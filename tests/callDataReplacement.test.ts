import { log } from "matchstick-as"
import { orders } from "./modules"
import { abi, shared } from "../src/modules"


// 0x68f0bcaa0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000002600000000000000000000000000000000000000000000000000000000000000004000000000000000000000000bfde6246df72d3ca86419628cac46a9d2b60393c000000000000000000000000bfde6246df72d3ca86419628cac46a9d2b60393c000000000000000000000000bfde6246df72d3ca86419628cac46a9d2b60393c000000000000000000000000bfde6246df72d3ca86419628cac46a9d2b60393c0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000019023b872dd000000000000000000000000ee80db4997098b2b517223636f15d51a61f3549b0000000000000000000000008e5d30f161ba3ebb09dc3c1f06515656af34baa100000000000000000000000000000000000000000000000000000000000004b223b872dd000000000000000000000000ee80db4997098b2b517223636f15d51a61f3549b0000000000000000000000008e5d30f161ba3ebb09dc3c1f06515656af34baa1000000000000000000000000000000000000000000000000000000000000052623b872dd000000000000000000000000ee80db4997098b2b517223636f15d51a61f3549b0000000000000000000000008e5d30f161ba3ebb09dc3c1f06515656af34baa100000000000000000000000000000000000000000000000000000000000006b623b872dd000000000000000000000000ee80db4997098b2b517223636f15d51a61f3549b0000000000000000000000008e5d30f161ba3ebb09dc3c1f06515656af34baa1000000000000000000000000000000000000000000000000000000000000057100000000000000000000000000000000 
export function testDecoderUpgrade(): void {
	let buyCalldata = orders.helpers.hexToBytes("0x23b872dd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000007e1dcf785f0353bf657c38ab7865c1f184efe2080000000000000000000000000000000000000000000000000000000002fb1796")
	let buyReplacementPattern = orders.helpers.hexToBytes("0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
	let sellCalldata = orders.helpers.hexToBytes("0x23b872dd0000000000000000000000008c5fc43ad00cc53e11f61bece329ddc5e3ea092900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002fb1796")
	let decodedResult = abi.decodeSingleNftData(
		buyCalldata,
		sellCalldata,
		buyReplacementPattern
	)

	log.info(
		"\ntestDecoderUpgrade :: abi decoded\n · · · method( {} )\n · · · from( {}) \n · · · to( {})\n · · · id( {}) ",
		[decodedResult.method, decodedResult.from.toHexString(), decodedResult.to.toHexString(), decodedResult.token.toString()]
	)
	let orderDecoded = orders.helpers.decodeData(orders.helpers.guardedArrayReplace(
		buyCalldata, sellCalldata, buyReplacementPattern
	))
	log.info(
		"\ntestDecoderUpgrade :: order decoded\n · · · method( {} )\n · · · from( {}) \n · · · to( {})\n · · · id( {}) ",
		[orderDecoded[0], orderDecoded[1], orderDecoded[2], shared.helpers.hexToBigInt(orderDecoded[3]).toString()]
	)
}

export function test_decode_transferFrom_noTrail(): void {
	let mergedCallData = "23b872dd000000000000000000000000ee80db4997098b2b517223636f15d51a61f3549b0000000000000000000000008e5d30f161ba3ebb09dc3c1f06515656af34baa1000000000000000000000000000000000000000000000000000000000000057100000000000000000000000000000000 "
	let result = abi.decodeAbi_transferFrom_Method(mergedCallData)
	log.info(
		"\test_decode_transferFrom_noTrail :: decodeAbi_transferFrom_Method \n · · · mergedData( {} )\n · · · result( {})",
		[mergedCallData, result.toLogFormattedString()]
	)
}
export function testBatch(): void {
	/*

	"data": {
		"buys": [
		{
			"callData": "0x68f0bcaa0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000002600000000000000000000000000000000000000000000000000000000000000004000000000000000000000000bfde6246df72d3ca86419628cac46a9d2b60393c000000000000000000000000bfde6246df72d3ca86419628cac46a9d2b60393c000000000000000000000000bfde6246df72d3ca86419628cac46a9d2b60393c000000000000000000000000bfde6246df72d3ca86419628cac46a9d2b60393c0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000019023b872dd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008e5d30f161ba3ebb09dc3c1f06515656af34baa100000000000000000000000000000000000000000000000000000000000004b223b872dd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008e5d30f161ba3ebb09dc3c1f06515656af34baa1000000000000000000000000000000000000000000000000000000000000052623b872dd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008e5d30f161ba3ebb09dc3c1f06515656af34baa100000000000000000000000000000000000000000000000000000000000006b623b872dd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008e5d30f161ba3ebb09dc3c1f06515656af34baa1000000000000000000000000000000000000000000000000000000000000057100000000000000000000000000000000",
			"id": "0x1e10c820a2c2708bd69def89b80327e4357dc60dee52048abe04094f9343c58f",
			"maker": {
			"address": "0x8e5d30f161ba3ebb09dc3c1f06515656af34baa1"
			},
			"taker": {
			"address": "0xee80db4997098b2b517223636f15d51a61f3549b"
			},
			"replacementPattern": "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
		}
		],
		"sells": [
		{
			"callData": "0x68f0bcaa0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000002600000000000000000000000000000000000000000000000000000000000000004000000000000000000000000bfde6246df72d3ca86419628cac46a9d2b60393c000000000000000000000000bfde6246df72d3ca86419628cac46a9d2b60393c000000000000000000000000bfde6246df72d3ca86419628cac46a9d2b60393c000000000000000000000000bfde6246df72d3ca86419628cac46a9d2b60393c0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000019023b872dd000000000000000000000000ee80db4997098b2b517223636f15d51a61f3549b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004b223b872dd000000000000000000000000ee80db4997098b2b517223636f15d51a61f3549b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000052623b872dd000000000000000000000000ee80db4997098b2b517223636f15d51a61f3549b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006b623b872dd000000000000000000000000ee80db4997098b2b517223636f15d51a61f3549b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000057100000000000000000000000000000000",
			"id": "0xdce8a616f65a83f10f9078d9320436d22e12138d3b6c1bf5f1563bb9722f1fb",
			"maker": {
			"address": "0xee80db4997098b2b517223636f15d51a61f3549b"
			},
			"taker": {
			"address": "0x0000000000000000000000000000000000000000"
			},
			"replacementPattern": "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
		}
		]
	}
	*/

	let buyCalldata = orders.helpers.hexToBytes("0x68f0bcaa0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000002600000000000000000000000000000000000000000000000000000000000000004000000000000000000000000bfde6246df72d3ca86419628cac46a9d2b60393c000000000000000000000000bfde6246df72d3ca86419628cac46a9d2b60393c000000000000000000000000bfde6246df72d3ca86419628cac46a9d2b60393c000000000000000000000000bfde6246df72d3ca86419628cac46a9d2b60393c0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000019023b872dd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008e5d30f161ba3ebb09dc3c1f06515656af34baa100000000000000000000000000000000000000000000000000000000000004b223b872dd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008e5d30f161ba3ebb09dc3c1f06515656af34baa1000000000000000000000000000000000000000000000000000000000000052623b872dd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008e5d30f161ba3ebb09dc3c1f06515656af34baa100000000000000000000000000000000000000000000000000000000000006b623b872dd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008e5d30f161ba3ebb09dc3c1f06515656af34baa1000000000000000000000000000000000000000000000000000000000000057100000000000000000000000000000000")
	let buyReplacementPattern = orders.helpers.hexToBytes("0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
	let sellCalldata = orders.helpers.hexToBytes("0x68f0bcaa0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000002600000000000000000000000000000000000000000000000000000000000000004000000000000000000000000bfde6246df72d3ca86419628cac46a9d2b60393c000000000000000000000000bfde6246df72d3ca86419628cac46a9d2b60393c000000000000000000000000bfde6246df72d3ca86419628cac46a9d2b60393c000000000000000000000000bfde6246df72d3ca86419628cac46a9d2b60393c0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000019023b872dd000000000000000000000000ee80db4997098b2b517223636f15d51a61f3549b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004b223b872dd000000000000000000000000ee80db4997098b2b517223636f15d51a61f3549b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000052623b872dd000000000000000000000000ee80db4997098b2b517223636f15d51a61f3549b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006b623b872dd000000000000000000000000ee80db4997098b2b517223636f15d51a61f3549b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000057100000000000000000000000000000000")

	let buyMergedData = abi.guardedArrayReplace(buyCalldata, sellCalldata, buyReplacementPattern);
	log.info(
		"\ntestCallDataReplacement :: guardedArrayReplace \n · · · buyMergedData( {} )\n · · · sellMergedData(  )",
		[buyMergedData.toHexString()]
	)
	let decoded = abi.decodeBatchNftData(buyCalldata, sellCalldata, buyReplacementPattern)


	log.info(
		"\ntestCallDataReplacement :: decodeData\n · · · method( {} )\n · · · addressList( {}) \n · · · transfers( {}) ",
		[decoded.method, decoded.addressList.toString(), decoded.transfers.toString()]
	)
}