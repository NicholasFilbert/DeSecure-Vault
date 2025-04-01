import ConnectButton from "@/components/auth/ConnectButton";
import Image from "next/image";

export default function Home() {
  return (
    <div className="mx-3">
      {/* header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center">
          <Image
            src={'/logo.png'}
            width={64}
            height={64}
            alt=""
          />
          <span className="font-bold text-xl">
            Shadow Vault
          </span>
        </div>

        <div>
          <ConnectButton />
        </div>
      </div>

      {/* Content */}
      <div className="w-full text-center">
        <div className="text-center text-4xl font-bold mb-8">
          <span className="font-bold">Your data, your power.</span>
          <br className="mb-2" />
          <span className="text-purple-400">Stored securely onchain — forever.</span>
        </div>

        <div className="flex justify-center text-primary">
          <ConnectButton label="Connect your wallet to unlock exclusive features!" />
        </div>
      </div>

    </div>
  )
}
