import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import './SidePanel.css';
import { IconContext } from 'react-icons';

import Favorited from './Favorited';
import ChatRooms from './ChatRooms';
import DirectMessages from './DirectMessages';
import { IoIosChatboxes } from 'react-icons/io';


function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar'>
          <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu' }>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>

            <div
              className = 'sidebarback'
              style={{
                    // backgroundColor:'#a0a0a1',
                    color: 'white',
                    width: '100%',
                    // marginRight: '100%',
                    fontFamily: 'poor story'
                    }}>
                      {/* Logo */}
                      <h3 style={{ color: 'white', fontSize: "1.5rem", marginLeft: 7, marginTop:'50px' }}>
                          <IoIosChatboxes />{" "} 뭉쳐야 개발
                      </h3>
            <Favorited />
            <ChatRooms />
            <DirectMessages />
            </div>

          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;