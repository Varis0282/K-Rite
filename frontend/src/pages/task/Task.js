import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { baseUrl } from '../../config'
import { useDispatch } from 'react-redux'
import { setLoading } from '../../redux/LoaderReducer'
import { message, Card, Avatar, Tooltip } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Navbar, Modal } from '../../components'
const { Meta } = Card;


const Task = () => {

  const [task, setTask] = useState([]);
  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [filteredTasks, setFilteredTasks] = useState([]);
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [currentTask, setCurrentTask] = useState(null);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `${localStorage.getItem("token")}`,
  }

  const handleEdit = (task) => {
    setCurrentTask(task);
    setOpenEdit(true);
  }

  const getTasks = async () => {
    dispatch(setLoading(true))
    try {
      const response = await axios.get(`${baseUrl}/api/task`, { headers })
      if (response.data.success) {
        message.success(response.data.message)
        setTask(response.data.tasks)
      }
    } catch (error) {
      message.error(error?.response?.data?.message || 'Some error occured')
      console.log("Error in getTasks", error);
    }
    dispatch(setLoading(false))
  };

  const convertDate = (date) => {
    let d = new Date(date);
    return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}, ${d.getFullYear()}`
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    let filteredData = task.filter((val) => {
      return val.title.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setFilteredTasks(filteredData);
  }

  const deleteTask = async (id) => {
    dispatch(setLoading(true))
    try {
      const response = await axios.delete(`${baseUrl}/api/task/${id}`, { headers })
      if (response.data.success) {
        message.success(response.data.message)
        getTasks();
      }
    } catch (error) {
      message.error(error?.response?.data?.message || 'Some error occured')
      console.log("Error in deleteTask", error);
    }
    dispatch(setLoading(false))
  }

  useEffect(() => {
    getTasks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (search === '') {
      setFilteredTasks(task)
    }
  }, [search, task]);

  return (
    task && (
      <div className='flex flex-col'>
        <Navbar search={search} handleSearchChange={handleSearchChange} />
        <h1 className='flex flex-row justify-between py-8 text-3xl font-bold text-center mb-5'>
          <p className='w-1/3'></p>
          <p className='w-1/3'>Tasks</p>
          <p className='w-1/3 flex text-[14px] justify-end px-5'>
            <button className='bg-orange-500 rounded text-white px-4' onClick={() => setOpen(true)}>Add Tasks</button>
            <Modal open={open} setOpen={setOpen} type={'add'} getTasks={getTasks} />
          </p>
        </h1>
        <div className='flex justify-evenly md:flex-nowrap flex-wrap gap-y-3 flex-row items-center'>
          {filteredTasks.map((task, index) => (
            <Card
              style={{
                width: 300,
              }}
              hoverable
              actions={[
                <Tooltip title="Edit task" key="setting">
                  <EditOutlined key="edit" onClick={() => handleEdit(task)} />
                  {currentTask && <Modal open={openEdit} setCurrentTask={setCurrentTask} setOpen={setOpenEdit} type={'edit'} data={currentTask} getTasks={getTasks} />}
                </Tooltip>,
                <Tooltip title="Delete task" key="setting">
                  <DeleteOutlined key="delete"
                    onClick={() => { deleteTask(task._id) }} 
                  />
                </Tooltip>
              ]}
            >
              <Meta
                avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                title={task?.title}
                description={task?.description}
              />
              <div className={`flex items-center justify-center mt-3 rounded text-white text-[16px] font-medium ${task?.status === 'Pending' ? 'bg-yellow-500' : task?.status === 'In Progress' ? 'bg-blue-500' : 'bg-green-500'}`}>
                {task?.status}
              </div>
              <div className='flex flex-col mt-3 text-[14px]'>
                <div className='font-medium'>
                  <span>Priority : </span>
                  <span
                    className={`${task?.priority === 'High' ? 'text-red-500' : task?.priority === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}
                  >
                    {task?.priority}
                  </span>
                </div>
                <div className='font-medium'>
                  <span>Deadline : </span>
                  <span>
                    {convertDate(task?.deadline)}
                  </span>
                </div>
                <div className='font-medium'>
                  <span>Created at : </span>
                  <span>
                    {convertDate(task?.createdAt)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  )
}

export default Task
