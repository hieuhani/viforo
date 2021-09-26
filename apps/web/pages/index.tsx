import { LayoutHome } from 'layouts/home/LayoutHome';

export default function Index() {
  return (
    <LayoutHome
      leftBar={<div>1</div>}
      main={<div>2</div>}
      rightBar={<div>3</div>}
    />
  );
}
