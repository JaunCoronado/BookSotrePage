import Head from 'next/head'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { FieldError, SubmitHandler, useForm } from 'react-hook-form';
import { loginBg } from '../constants/books';
import useAuth from '../hooks/useAuth'
import Link from "next/link"

interface Inputs {
  name: string,
  email: string,
  password: string,
  confirmPassword: string
};

const signup = () => {
  const [login, setLogin] = useState(false)
  const { signIn, signUp, error } = useAuth()

  const { register, handleSubmit, formState: { errors }, watch } = useForm<Inputs>();
  const password = useRef({});
  password.current = watch("password", "");
  const onSubmit: SubmitHandler<Inputs> = async ({ name, email, password, confirmPassword }) => {
    const user = {
      name,
      email,
      password,
      confirmPassword
    }
    await signUp(user)
  };

  return (
    <div className="relative flex h-screen w-screen flex-col bg-black 
    md:items-center md:justify-center md:bg-transparent">
      <Head>
        <title>Signup</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Image
        src={loginBg}
        layout="fill"
        className="-z-10 !hidden opacity-60 sm:!inline"
        objectFit="cover"
      />

      <form className='relative mt-24 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14'
        onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-4xl font-semibold">Sign Up</h1>
        <div className="space-y-4">
          <label className='inline-block w-full'>
            <input type="text" placeholder='Name' className='input'
              {...register('name', { required: true })} />
            {errors.name && (
              <p className="p-1 text-[13px] font-light  text-orange-500">
                Name is required.
              </p>
            )}
          </label>
          <label className='inline-block w-full'>
            <input type="email" placeholder='Email' className='input'
              {...register('email', { required: true })} />
            {errors.email && (
              <p className="p-1 text-[13px] font-light  text-orange-500">
                Please enter a valid email.
              </p>
            )}
          </label>
          <label className='inline-block w-full'>
            <input type="password" placeholder='Password' className='input'
              {...register('password', {
                required: "You must specify a password",
                minLength: {
                  value: 8,
                  message: "Password must have at least 8 characters"
                }
              })} />
            {errors.password && (
              <p className="p-1 text-[13px] font-light  text-orange-500">
                {errors.password.message}
              </p>
            )}
          </label>
          <label className='inline-block w-full'>
            <input type="password" placeholder='Confirm Password' className='input'
              {...register('confirmPassword', { validate: value =>
                value === password.current || "The passwords do not match"})} />
            {errors.confirmPassword && (
              <p className="p-1 text-[13px] font-light  text-orange-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </label>
        </div>

        <button type="submit" className='w-full rounded bg-[#e50914] py-3 font-semibold' onClick={() => setLogin(true)}>
          Create an account
        </button>

        <div className='flex text-[gray]'>
          Already have an account? {" "}
          <Link href="/login"><p className='text-white hover:underline ml-2'>Log in now</p></Link>
        </div>
      </form>
    </div>
  )
}

export default signup