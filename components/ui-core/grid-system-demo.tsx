export function GridSystemDemo() {
  return (
    <div className="space-y-lg">
      <section>
        <h2 className="text-xl font-bold mb-sm">Container Classes</h2>
        <div className="space-y-md">
          <div className="container border border-dashed border-gray-300 p-sm">
            <div className="bg-blue-100 p-sm text-center">
              <p className="font-medium">Container (Responsive)</p>
              <p className="text-sm text-gray-500">Padding: 16px → 24px → 32px → 64px → 96px → 100px</p>
            </div>
          </div>

          <div className="container-desktop border border-dashed border-gray-300 p-sm">
            <div className="bg-green-100 p-sm text-center">
              <p className="font-medium">Container Desktop</p>
              <p className="text-sm text-gray-500">Max-width: 1280px, Padding: 100px (responsive)</p>
            </div>
          </div>

          <div className="container-tablet border border-dashed border-gray-300 p-sm">
            <div className="bg-yellow-100 p-sm text-center">
              <p className="font-medium">Container Tablet</p>
              <p className="text-sm text-gray-500">Max-width: 768px, Padding: 64px (responsive)</p>
            </div>
          </div>

          <div className="container-mobile border border-dashed border-gray-300 p-sm">
            <div className="bg-red-100 p-sm text-center">
              <p className="font-medium">Container Mobile</p>
              <p className="text-sm text-gray-500">Max-width: 480px, Padding: 24px</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-sm">Grid Spacing</h2>
        <div className="container border border-dashed border-gray-300 p-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-purple-100 p-sm text-center rounded-md">
                <p className="font-medium">Grid Item {item}</p>
                <p className="text-sm text-gray-500">gap-lg (32px)</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-sm">Vertical Rhythm</h2>
        <div className="container border border-dashed border-gray-300 p-sm">
          <div className="space-y-lg">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-indigo-100 p-sm text-center rounded-md">
                <p className="font-medium">Section {item}</p>
                <p className="text-sm text-gray-500">space-y-lg (32px)</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
