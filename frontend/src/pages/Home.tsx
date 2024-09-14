import React from 'react'
import { useAppSelector } from '../redux/hooks'
import { selectUser } from '../redux/reducers/userReducer'

function Home() {
  const isSignedIn = useAppSelector(selectUser)

  const home = (<h1>Welocom Home</h1>)
  const blogs = (<h1>Welocom Blogs</h1>)

  return (
    <div>
      {!isSignedIn ? home : blogs}
    </div>
  )
}

export default Home