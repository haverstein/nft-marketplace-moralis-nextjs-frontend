import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import basicNftAbi from "../constants/BasicNft.json"

export default function NFTBox({ price, nftAddress, tokenId, marketplaceAddress, seller }) {
    const { isWeb3Enabled } = useMoralis()
    const [imageUri, setImageUri] = useState("")
    const { runContractFunction: getTokenUri } = useWeb3Contract({
        abi: basicNftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })
    async function updateUi() {
        const tokenURI = await getTokenUri()
        console.log(tokenURI)
    }
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUi()
        }
    }, [isWeb3Enabled])
}
