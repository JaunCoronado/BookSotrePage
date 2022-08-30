import { BellIcon, SearchIcon } from "@heroicons/react/solid"
import { Avatar } from "@mui/material"
import Link from "next/link"
import { useState, useEffect } from "react"
import useAuth from "../hooks/useAuth"
import { deepOrange } from '@mui/material/colors';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function Header() {
  const { user, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.addEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header className={`${isScrolled && "bg-[#141414]"}`}>
      <div className="flex items-center space-x-2 md:space-x-10">
        <img src="https://rb.gy/ulxxee" width={100} height={100}
          className="cursor-pointer object-contain" />

        <ul className="hidden space-x-4 md:flex">
          <li className="headerLink">
            <Link href="/">Home</Link>
          </li>
          <li className="headerLink">
            <Link href="/MyBooks">My Books</Link>
          </li>
        </ul>
      </div>
      <div className="flex items-center space-x-4 text-sm font-light">
        <Avatar onClick={handleClick} sx={{ bgcolor: deepOrange[500] }}>{user?.name[0]}</Avatar>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </header>
  )
}

export default Header