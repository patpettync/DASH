export function ContainerLayoutDemo() {
  return (
    <div className="space-y-lg">
      <div className="bg-blue-100 p-md rounded-md">
        <h2 className="text-xl font-semibold mb-sm">Container Layout Demo</h2>
        <p className="mb-md">
          This component demonstrates the <code className="bg-blue-50 px-xs py-[2px] rounded">container-layout</code>{" "}
          utility class, which standardizes horizontal layout padding and max-width using the design token system.
        </p>
        <div className="bg-blue-50 p-sm rounded-md">
          <p className="font-medium">Container Layout Properties:</p>
          <ul className="list-disc list-inside mt-xs">
            <li>max-width: 1280px</li>
            <li>margin-left: auto</li>
            <li>margin-right: auto</li>
            <li>
              Responsive padding:
              <ul className="list-disc list-inside ml-md">
                <li>Small screens: 16px (spacing.sm)</li>
                <li>Medium screens: 24px (spacing.md)</li>
                <li>Large screens: 32px (spacing.lg)</li>
                <li>Extra-large screens: 40px (spacing.xl)</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-blue-100 opacity-20"></div>
        <div className="container-layout relative">
          <div className="bg-white shadow-md rounded-md p-md">
            <h3 className="text-lg font-medium mb-sm">Container Layout Example</h3>
            <p>
              This box is wrapped in a <code className="bg-gray-100 px-xs py-[2px] rounded">container-layout</code>{" "}
              element. Notice how it maintains consistent horizontal padding that adapts to different screen sizes.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-100 to-blue-100 py-md">
        <div className="container-layout">
          <div className="bg-white shadow-md rounded-md p-md">
            <h3 className="text-lg font-medium mb-sm">Another Example</h3>
            <p>
              This is another example of the{" "}
              <code className="bg-gray-100 px-xs py-[2px] rounded">container-layout</code> utility class in action. The
              container has a max-width of 1280px and is centered on the page.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 py-md">
        <div className="container-layout">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white shadow-md rounded-md p-md">
                <h3 className="text-lg font-medium mb-sm">Card {item}</h3>
                <p>
                  This card is part of a grid layout inside a{" "}
                  <code className="bg-gray-100 px-xs py-[2px] rounded">container-layout</code> element.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
