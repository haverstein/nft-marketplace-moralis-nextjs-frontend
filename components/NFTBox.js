import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import basicNftAbi from "../constants/BasicNft.json"
import Image from "next/image"
import { Card } from "web3uikit"
import { ethers } from "ethers"

export default function NFTBox({ price, nftAddress, tokenId, marketplaceAddress, seller }) {
    const { isWeb3Enabled } = useMoralis()
    const [imageUri, setImageUri] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
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
        console.log(`The token uri is ${tokenURI}`)
        if (tokenURI) {
            // IPFS Gateway: A server that will return IPFS files from a normal url.
            const requestUrl = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestUrl)).json()
            const imageURI = tokenURIResponse.image
            const imageUrl = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageUri(imageUrl)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
            // Alternate way: 1. We could render image on our server and call our server(Moralis)
            // 2. use Moralis Hooks
        }
    }
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUi()
        }
    }, [isWeb3Enabled])
    return (
        <div>
            <div>
                {imageUri ? (
                    <Card title={tokenName} description={tokenDescription}>
                        <div className="p-2">
                            <div className="flex flex-col items-end gap-2">
                                <div>#{tokenId}</div>
                                <div className="italic text-sn">Owned by {seller}</div>
                                <Image
                                    loader={() => imageUri}
                                    src={imageUri}
                                    height="200"
                                    width="200"
                                />
                                <div className="font-bold">
                                    {ethers.utils.formatUnits(price, "ether")} ETH
                                </div>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    )
}
