export default function ConnectButton({label="Connect Wallet"}: {label?:string}) {
  return (
    <appkit-button 
      label={label}
      loadingLabel="Loading..." 
    />
  )
}