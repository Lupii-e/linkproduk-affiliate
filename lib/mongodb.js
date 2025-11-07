// Kode ini adalah boilerplate resmi dari Next.js/MongoDB
// untuk mengelola koneksi database

import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise

if (process.env.NODE_ENV === 'development') {
  // Di mode development, pakai global variable
  // agar koneksi tetap ada saat Hot Module Replacement (HMR)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // Di mode production, tidak perlu global variable
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Ekspor promise koneksi ini agar bisa dipakai di file lain
export default clientPromise