import LayoutWithHeader from 'layouts/admin/LayoutWithHeader';

const Categories: React.FunctionComponent = () => {
  return (
    <LayoutWithHeader>
      <div className="container">
        <h3 className="py-4 text-xl font-medium">Categories</h3>
        <div className="bg-white rounded-md p-4">Main</div>
      </div>
    </LayoutWithHeader>
  );
};

export default Categories;
