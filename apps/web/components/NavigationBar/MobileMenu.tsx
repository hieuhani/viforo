interface MobileMenuProps {
  onClose: () => void;
}
export const MobileMenu: React.FunctionComponent<MobileMenuProps> = ({
  onClose,
}) => (
  <div className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
    <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50 relative">
      <div className="pt-5 pb-6 px-5">
        <div>
          <button
            onClick={onClose}
            type="button"
            className="absolute right-2 top-2 bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span className="sr-only">Close menu</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <nav className="grid gap-y-8">
            <a
              href="https://bovagau.vn/wp-content/uploads/ebook.pdf"
              className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
            >
              <svg
                className="flex-shrink-0 h-6 w-6 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span className="ml-3 text-base font-medium text-gray-900">
                Tải sách
              </span>
            </a>

            <a
              href="http://bit.ly/trader100tr"
              className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
            >
              <svg
                className="flex-shrink-0 h-6 w-6 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
              <span className="ml-3 text-base font-medium text-gray-900">
                Đăng ký trải nghiệm
              </span>
            </a>
          </nav>
        </div>
      </div>
      <div className="py-6 px-5 space-y-6">
        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
          <a
            href="https://bovagau.vn/wp-content/uploads/ebook.pdf"
            className="text-base font-medium text-gray-900 hover:text-gray-700"
          >
            Tài chính
          </a>

          <a
            href="http://bit.ly/trader100tr"
            className="text-base font-medium text-gray-900 hover:text-gray-700"
          >
            Hot Trend
          </a>
        </div>
        <div>
          <a
            href="#"
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary"
          >
            Đăng ký
          </a>
          <p className="mt-6 text-center text-base font-medium text-gray-500">
            Bạn đã có tài khoản?{" "}
            <a href="#" className="text-primary hover:text-primary">
              Đăng nhập
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
);
