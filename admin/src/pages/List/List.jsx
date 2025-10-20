import React, { useEffect, useState } from 'react'
import './List.css'
import { url, currency } from '../../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {

  const [list, setList] = useState([]);
  const [isDummyData, setIsDummyData] = useState(false);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`)
      if (response.data.success) {
        setList(response.data.data);
        
        // Check if dummy data is being used
        if (response.data.isDummy) {
          setIsDummyData(true);
          toast.warning("⚠️ Database not connected. Showing sample data.", {
            position: "top-center",
            autoClose: 5000,
          });
        } else {
          setIsDummyData(false);
        }
      }
      else {
        toast.error("Error loading food list")
      }
    } catch (error) {
      toast.error("Failed to connect to server");
    }
  }

  const removeFood = async (foodId) => {
    if (isDummyData) {
      toast.error("Cannot delete items when database is not connected");
      return;
    }
    
    const response = await axios.post(`${url}/api/food/remove`, {
      id: foodId
    })
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    }
    else {
      toast.error("Error")
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='list add flex-col'>
      <p>All Foods List {isDummyData && <span style={{color: 'orange', fontSize: '14px'}}>(Sample Data - DB Not Connected)</span>}</p>
      <div className='list-table'>
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className='list-table-format'>
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <p className={isDummyData ? 'cursor-disabled' : 'cursor'} 
                 onClick={() => removeFood(item._id)} 
                 style={isDummyData ? {opacity: 0.5, cursor: 'not-allowed'} : {}}>x</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List
