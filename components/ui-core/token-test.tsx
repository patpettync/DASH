export function TokenTest() {
  return (
    <div className="p-md bg-gray-100 rounded-md">
      <h2 className="text-lg mb-sm">Token-Based Spacing Test</h2>

      <div className="mb-md">
        <h3 className="text-base mb-xs">Padding Tokens</h3>
        <div className="flex gap-sm">
          <div className="p-xs bg-blue-100 border border-blue-300">p-xs (8px)</div>
          <div className="p-sm bg-blue-100 border border-blue-300">p-sm (16px)</div>
          <div className="p-md bg-blue-100 border border-blue-300">p-md (24px)</div>
        </div>
      </div>

      <div className="mb-md">
        <h3 className="text-base mb-xs">Margin Tokens</h3>
        <div className="flex">
          <div className="mr-xs bg-green-100 border border-green-300">mr-xs</div>
          <div className="mr-sm bg-green-100 border border-green-300">mr-sm</div>
          <div className="mr-md bg-green-100 border border-green-300">mr-md</div>
        </div>
      </div>

      <div className="mb-md">
        <h3 className="text-base mb-xs">Gap Tokens</h3>
        <div className="flex gap-xs mb-sm">
          <div className="bg-purple-100 border border-purple-300 p-xs">gap-xs</div>
          <div className="bg-purple-100 border border-purple-300 p-xs">gap-xs</div>
          <div className="bg-purple-100 border border-purple-300 p-xs">gap-xs</div>
        </div>
        <div className="flex gap-sm mb-sm">
          <div className="bg-purple-100 border border-purple-300 p-xs">gap-sm</div>
          <div className="bg-purple-100 border border-purple-300 p-xs">gap-sm</div>
          <div className="bg-purple-100 border border-purple-300 p-xs">gap-sm</div>
        </div>
      </div>

      <div className="mb-md">
        <h3 className="text-base mb-xs">Space Tokens</h3>
        <div className="flex space-x-xs mb-sm">
          <div className="bg-amber-100 border border-amber-300 p-xs">space-x-xs</div>
          <div className="bg-amber-100 border border-amber-300 p-xs">space-x-xs</div>
          <div className="bg-amber-100 border border-amber-300 p-xs">space-x-xs</div>
        </div>
        <div className="flex space-x-sm mb-sm">
          <div className="bg-amber-100 border border-amber-300 p-xs">space-x-sm</div>
          <div className="bg-amber-100 border border-amber-300 p-xs">space-x-sm</div>
          <div className="bg-amber-100 border border-amber-300 p-xs">space-x-sm</div>
        </div>
      </div>

      <div className="mb-md">
        <h3 className="text-base mb-xs">Responsive Tokens</h3>
        <div className="p-xs sm:p-sm md:p-md lg:p-lg bg-red-100 border border-red-300">
          Responsive padding: p-xs → sm:p-sm → md:p-md → lg:p-lg
        </div>
      </div>
    </div>
  )
}
