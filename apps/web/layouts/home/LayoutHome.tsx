interface Props {
  leftBar: React.ReactNode
  main: React.ReactNode
  rightBar: React.ReactNode
}

export const LayoutHome: React.FunctionComponent<Props> = ({ leftBar, main, rightBar }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6">
    <div className="grid grid-cols-12 md:gap-4">
      <div className="lg:col-span-2">{leftBar}</div>
      <div className="col-span-24 lg:col-span-7">{main}</div>
      <div className="lg:col-span-3">
        <div className="w-full sticky top-20">{rightBar}</div>
      </div>
    </div>
  </div>
);
