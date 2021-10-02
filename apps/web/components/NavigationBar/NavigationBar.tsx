/* eslint-disable @next/next/no-img-element */
import { Dropdown } from 'components/Dropdown';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from 'services/auth';
import {
  IoSettingsOutline,
  IoExitOutline,
  IoAlbumsOutline,
  IoNotificationsOutline,
} from 'react-icons/io5';

import { MobileMenu } from './MobileMenu';

export const NavigationBar: React.FunctionComponent = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const toggleMenu = () => setMenuOpened(!menuOpened);
  const { myUser, checking } = useAuth();
  return (
    <div className="backdrop-filter backdrop-blur-3xl bg-white bg-opacity-75 fixed w-full z-20 top-0 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-1 md:justify-start">
          <Link href="/">
            <a className="flex items-center">
              <span className="sr-only">Viforo</span>
              <svg
                width="44"
                height="44"
                viewBox="0 0 1000 1000"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M823.758 315.169H696.089L653.533 251.334L696.089 187.5L823.758 315.169Z"
                  fill="#E93CE9"
                ></path>
                <path
                  d="M483.308 667.108L561.399 661.363L554.376 740.732L483.308 825.844V667.108Z"
                  fill="black"
                ></path>
                <path
                  d="M696.089 187.5V570.507L582.875 499.849L483.308 357.725L696.089 187.5Z"
                  fill="black"
                ></path>
                <path
                  d="M483.307 357.725L525.864 491.138L483.307 667.108L142.857 315.169H440.751L483.307 357.725Z"
                  fill="#E93CE9"
                ></path>
                <path
                  d="M696.089 570.506L554.376 740.732L483.308 667.108V357.725L696.089 570.506Z"
                  fill="#3D2077"
                ></path>
              </svg>
            </a>
          </Link>
          <div className="-mr-2 -my-2 md:hidden">
            <button
              type="button"
              className="rounded-md p-2 inline-flex items-center justify-center text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset"
              aria-expanded="false"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open menu</span>
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          <nav className="hidden md:flex ml-2">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search"
                type="search"
              />
            </div>
          </nav>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
            <IoNotificationsOutline className="h-6 w-6 text-gray-600" />
            <div className="border-l h-6" />
            {!checking && myUser ? (
              <Dropdown
                trigger={
                  <button className="flex">
                    <img
                      className="inline-block h-10 w-10 rounded-full ring-2 ring-white border-2 border-transparent hover:border-gray-100"
                      src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </button>
                }
                dropdownClassName="w-56 p-1"
              >
                <a
                  href="#"
                  className="text-gray-700 block px-4 py-2 hover:bg-gray-100 rounded-md"
                  role="menuitem"
                >
                  <h3 className="font-medium">{myUser.account.fullName}</h3>
                  <p className="text-sm">@{myUser.account.username}</p>
                </a>
                <hr className="border-gray-100 my-1" />
                <a
                  href="#"
                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center"
                  role="menuitem"
                >
                  <IoAlbumsOutline className="h-4 w-4 mr-2" />
                  Dashboard
                </a>
                <a
                  href="#"
                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center"
                  role="menuitem"
                >
                  <IoSettingsOutline className="h-4 w-4 mr-2" />
                  Settings
                </a>
                <a
                  href="#"
                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center"
                  role="menuitem"
                >
                  <IoExitOutline className="h-4 w-4 mr-2" />
                  Sign out
                </a>
              </Dropdown>
            ) : (
              <>
                <Link href="/auth/sign_in">
                  <a className="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-base font-medium text-indigo-600 rounded-full">
                    Sign in
                  </a>
                </Link>
                <Link href="/auth/sign_up">
                  <a className="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 rounded-full">
                    Sign up
                  </a>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {menuOpened && <MobileMenu onClose={toggleMenu} />}
    </div>
  );
};
