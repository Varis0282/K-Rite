import { Modal, Button, Input, Select, DatePicker } from 'antd';
import { Field } from '../../components'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../config';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../redux/LoaderReducer';
import { message } from 'antd';
import moment from 'moment';
import { InfoCircleOutlined } from '@ant-design/icons';
const { TextArea } = Input;


const CustomModal = ({ open, setOpen, type, data, getTasks, setCurrentTask }) => {

  const [disableSave, setDisableSave] = useState(true);
  const [task, setTask] = useState(data || {});
  const [fixedTask, setFixedTask] = useState(data || {});

  const dispatch = useDispatch();

  const handleChange = (value) => {
    setTask({ ...task, priority: value });
  };

  const onChange = (date, dateString) => {
    setTask({ ...task, deadline: dateString });
  };

  const inputChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `${localStorage.getItem("token")}`,
  }

  const saveTask = async () => {
    console.log("task", task);
    if (type === 'add') {
      if (!task.title || !task.description || !task.priority || !task.deadline) {
        message.error("Please fill all the fields")
        return;
      }
      dispatch(setLoading(true))
      try {
        const response = await axios.post(`${baseUrl}/api/task`, task, { headers })
        if (response.data.success) {
          message.success(response.data.message)
          getTasks();
          closeModal();
        }
      } catch (error) {
        message.error(error?.response?.data?.message || 'Some error occured')
        console.log("Error in saveTask in add task", error);
      }
      dispatch(setLoading(false))
    } else {
      if (!task.description || !task.priority || !task.deadline) {
        message.error("Please fill all the fields")
        return;
      }
      dispatch(setLoading(true))
      try {
        const response = await axios.put(`${baseUrl}/api/task/${task._id}`, task, { headers })
        if (response.data.success) {
          message.success(response.data.message)
          getTasks();
          closeModal();
        }
      } catch (error) {
        message.error(error?.response?.data?.message || 'Some error occured')
        console.log("Error in saveTask in edit task", error);
        dispatch(setLoading(false))
      }
      dispatch(setLoading(false))

    }
  }

  const closeModal = () => {
    setTask({});
    type === 'edit' && setCurrentTask(null);
    setOpen(false);
  }

  useEffect(() => {
    if (type === 'edit') {
      if (task !== fixedTask) {
        setDisableSave(false);
      }
      if (task === fixedTask) {
        setDisableSave(true);
      }
    }
  }, [task, fixedTask, type]);

  return (
    <Modal
      title={type === "add" ? "Add Task" : "Edit Task"}
      centered
      open={open}
      onOk={() => closeModal()}
      onCancel={() => closeModal()}
      width={1000}
      footer={[
        <Button key="back" onClick={() => closeModal()}>
          Cancel
        </Button>,
        <Button key="submit" onClick={() => saveTask()} disabled={disableSave && type !== "add"}>
          Submit
        </Button>,
      ]}
    >
      <div className="flex flex-col gap-4">
        <Field label="Title" name="title" type="text" placeholder="Enter title" onChange={(e) => inputChange(e)} value={task.title} readOnly={type === "edit"}
          inputClassNames={`${type === "edit" && 'cursor-not-allowed'} `}
        />
        <div className="flex flex-col">
          <label className={"mb-2 flex items-center gap-2 text-sm font-medium text-gray-600"}>
            Description
          </label>
          <TextArea rows={4} placeholder='Enter Description' name='description' value={task.description} onChange={(e) => inputChange(e)} />
        </div>
        <div className="flex md:flex-row gap-4 flex-col justify-between w-full">
          <div className="flex flex-col md:w-[48%] w-full">
            <label className={"mb-2 flex items-center gap-2 text-sm font-medium text-gray-600"}>
              Priority
            </label>
            <Select
              defaultValue={task?.priority}
              onChange={handleChange}
              options={[
                {
                  value: 'Low',
                  label: 'Low',
                },
                {
                  value: 'Medium',
                  label: 'Medium',
                },
                {
                  value: 'High',
                  label: 'High',
                },
              ]}
            />
          </div>
          <div className="flex flex-col md:w-[48%] w-full">
            <label className={"mb-2 flex items-center gap-2 text-red-500 text-sm font-medium"}>
              Deadline
            </label>
            <DatePicker onChange={onChange} defaultValue={moment(task.deadline)} />
            <p className='text-[11px] text-gray-500 flex flex-row gap-2 mt-1 items-center'><InfoCircleOutlined className='text-[12px]'/>Clear date if the component behaves improper</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default CustomModal;