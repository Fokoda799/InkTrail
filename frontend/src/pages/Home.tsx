import React from 'react'
import { useAppSelector } from '../redux/hooks'
import { selectUserState } from '../redux/reducers/userReducer'

function Home() {
  const {isAuth} = useAppSelector(selectUserState);

  const home = (<h1>Welocom Home</h1>)
  const blogs = (<h1>Welocom Blogs</h1>)

  return (
    <div>
      {!isAuth ? home : blogs}
    </div>
  )
}

export default Home