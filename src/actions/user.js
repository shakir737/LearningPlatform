"use server";

import connectDB from "@/utilities/db";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";

const Registration = async (user) => {
  console.log(user);
  const { name, email, phone, password } = user;

  if (!name || !phone || !email || !password) {
    throw new Error("Please fill all fields");
  }

  await connectDB();

  // existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await hash(password, 12);
  await User.create({ name, email, password: hashedPassword, phone });
  console.log(`User created successfully 🥂`);
  redirect("/");
};

const FetchAllUsers = async () => {
  await connectDB();
  const users = await User.find({});
  return users;
};

export { Registration, FetchAllUsers };
