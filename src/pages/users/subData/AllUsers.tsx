import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useNavigate } from 'react-router-dom'
import { useQuery } from "@tanstack/react-query"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAllUsers } from '@/api/users/allusers'

const AllUsers = () => {
  const navigate = useNavigate()

  const { data, error, isLoading } = useQuery({
    queryKey: ["allusers"],
    queryFn: getAllUsers,
  });

  console.log(data)
if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error loading users</div>;

if (!Array.isArray(data)) return <div>No users found</div>;


  return (
    <>
      <Label className='text-2xl font-bold mb-4 flex justify-between items-center'>
        <header>All Users</header>
        <Button
          className='bg-blue-500 text-white hover:bg-blue-600'
          onClick={() => navigate("/users/create-new")}
        >
          Add New
        </Button>
      </Label>

      <Label>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center'>Username</TableHead>
              <TableHead className='text-center'>Email</TableHead>
              <TableHead className='text-center'>Role</TableHead>
              <TableHead className='text-center'>Mobile</TableHead>
              <TableHead className='text-center'>Profile Picture</TableHead>
              <TableHead className='text-center'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(data) && data?.map((user, i) => (
              <TableRow key={i}>
                <TableCell className='text-center'>{user.username}</TableCell>
                <TableCell className='text-center'>{user.email}</TableCell>
                <TableCell className='text-center'>{user.role}</TableCell>
                <TableCell className='text-center'>{user.mobile_no}</TableCell>
                <TableCell className='text-center'>
                  <img
                    src={user.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full mx-auto"
                  />
                </TableCell>
                <TableCell className='text-center'>
                  <Button
                    onClick={() => navigate(`/users/edit/${user._id}`)}
                    className='bg-yellow-500 text-white hover:bg-yellow-600'
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Label>
    </>
  )
}

export default AllUsers
