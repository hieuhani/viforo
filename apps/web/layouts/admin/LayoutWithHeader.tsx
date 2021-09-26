interface Props {
  header?: React.ReactNode;
}
const LayoutWithHeader: React.FunctionComponent<Props> = ({
  children,
  header,
}) => (
  <>
    {header && <div>{header}</div>}
    {children}
  </>
);

export default LayoutWithHeader;
