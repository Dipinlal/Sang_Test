import React,{ useEffect, useState } from 'react'
import './home.css'
import axios from 'axios';  
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

function Home() {


    
    const [formSubmitted, setformSubmitted] = useState(false)
    const [iTransIdSelected, setiTransIdSelected] = useState(0)
    const [iTransIdList, setiTransIdList] = useState('')
    const [projecExist, setprojecExist] = useState(false)
    const [serialNumber, setserialNumber] = useState(null)
    const [deleteRow,setDeleteRow] = useState(false)
    const [loading, setloading] = useState(false)
    const formDataToSubmit = new FormData();
    const [formData, setFormData] = useState({
        project: '',
        projectDetails: '',
        location: '',
        date: '',
        observations: [{}],
      });
    const [formData1, setformData1] = useState({
        project: '',
        projectDetails: '',
        location: '',
        date: '',
        observations: [{}],
      })
      const [checkedCheckboxes, setCheckedCheckboxes] = useState(Array(formData.observations.length).fill(false));
      const [editableRows, setEditableRows] = useState(Array(formData.observations.length).fill(true));
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        // console.log(name,value)
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const handleObservationChange = (index, e) => {
        const updatedObservations = [...formData.observations];
        const { name, value } = e.target;
        // console.log(name,value)
        if (!updatedObservations[index]) {
            updatedObservations[index] = {};
          }
        
          updatedObservations[index][name] = value;
        
          setFormData((prevFormData) => ({
            ...prevFormData,
            observations: updatedObservations,
          }));
      };

      const addRow = () => {
       
        setFormData((prevFormData) => ({
          ...prevFormData,
          observations: [...prevFormData.observations, {}],
        }));
         const lengthOfObservation = formData.observations.length
        const updatedEditableRows = [...editableRows];
        updatedEditableRows[lengthOfObservation] = true;
        setEditableRows(updatedEditableRows);
            
      };
    
      const handleImageSelect = (e) => {
        const sign1 = e.target.files[0];
        setFormData((prevFormData) => ({
          ...prevFormData,
          Signature:sign1,
          
        }))
        formDataToSubmit.append('Signature',sign1)
        
        
      };
     
      const handleSubmit =  async (e) => {
        e.preventDefault();
        console.log(formData)

        const Body = formData.observations;
       

                  const dataToSubmit = {
              "iTransId": iTransIdSelected,
              "DocDate": formData.date,
              "Project": parseInt(formData.project, 10),
              "ProjectDes":formData.projectDetails ,
              "Location": formData.location,
              "UserId":12345,
              "Signature":"Signature.jpg",
              "Body":Body
     
        }
     
        console.log(formData.date)
        
        formDataToSubmit.append('data', JSON.stringify(dataToSubmit));
        formDataToSubmit.append('Signature',"Signature.jpg" );

        try {
         
        
             const config = {
            headers: {
                'Content-type': 'multipart/form-data'
            }
           }
         
       
      //  console.log(formDataToSubmit.get('data'));
      //  console.log(formDataToSubmit.get('Signature'));
            
             const response = await axios.post('http://103.120.178.195/HSEAPI/Ray/PostHSE',formDataToSubmit,config);
      
           
            console.log('Form submitted successfully:', response.data);
            toast('Form Submitted Successfully!', {
              position: toast.POSITION.BOTTOM_CENTER,
              type: 'success',
              
            })
            setFormData({
              project: '',
              projectDetails: '',
              location: '',
              date: '',
              observations: [{}],
            });
            setiTransIdSelected(0)
            setformSubmitted(true)
            
          } catch (error) {
            
            console.error('Error submitting form:', error);
            toast('Verfiy form Data', {
              position: toast.POSITION.BOTTOM_CENTER,
              type: 'error',
              
            })
          }
       
       
        
      };
      const handleCheckboxChange = (index) => {
        const updatedCheckboxes = [...checkedCheckboxes];
        updatedCheckboxes[index] = !updatedCheckboxes[index];
        setCheckedCheckboxes(updatedCheckboxes);
      };
      const handleDelete = () =>{
        if(!(checkedCheckboxes.some((checked) => checked))){
          toast('Select Observations to delete', {
            position: toast.POSITION.BOTTOM_CENTER,
            type: 'error',
            
          })

        }
        const updatedObservations = formData.observations.filter(
          (_, index) => !checkedCheckboxes[index]
        );
        setFormData({
          ...formData,
          observations: updatedObservations,
        });
      
        
        setCheckedCheckboxes(Array(updatedObservations.length).fill(false));
        setEditableRows(Array(updatedObservations.length).fill(false))
      }
      
   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://103.120.178.195/HSEAPI/Ray/GetHSESummary?UserId=12345");

        
       


        const resultDataArray = JSON.parse(response.data.ResultData);
        

        const iTransIds = resultDataArray.map(item => item.iTransId);
        setiTransIdList(iTransIds)
       
        setprojecExist(true)

        // if(response){

        //   const formatDate = (dateString) => {
        //     const parts = dateString.split('-');
        //     if (parts.length === 3) {
        //       const [day, month, year] = parts;
        //       // Assuming the date format is "DD-MM-YYYY"
        //       return `${year}-${month}-${day}`;
        //     }
        //     return null;
        //   };
        //   const formattedDate = formatDate(resultDataArray[0].Date);
        //   console.log(formattedDate)

        //   setFormData({
        //     project: resultDataArray[0].Project,
        //     projectDetails: resultDataArray[0].Project,
        //     location: resultDataArray[0].sLocation,
        //     date: formattedDate,
        //     observations: [{}],
            
        //   });
        //   setprojecExist(true)
        // }
        setformSubmitted(false)
      } catch (error) {
        console.error('Error fetching data:', error);
        setprojecExist(false)
      }
    };

    fetchData(); 
  }, [formSubmitted]);

  const handleITransIdChange = async(e) =>{
    const {value } = e.target;
    setiTransIdSelected(value)
    console.log(value)

    try {
      const response = await axios.get(`http://103.120.178.195/HSEAPI/Ray/GetHSEDetails?iTransId=${value}`);
      
      const resultDataArray = JSON.parse(response.data.ResultData);
      console.log(resultDataArray)
      console.log(resultDataArray.Body)
         const formatDate = (dateString) => {
            const parts = dateString.split('-');
            if (parts.length === 3) {
              const [day, month, year] = parts;
              // Assuming the date format is "DD-MM-YYYY"
              return `${year}-${month}-${day}`;
            }
            return null;
          };
          const formattedDate = formatDate(resultDataArray.Header[0].Date);
         
          setEditableRows(Array(resultDataArray.Body.length).fill(false))

          const observations = resultDataArray.Body.map((observation) => ({
            Observation: observation.sObservation,
            RiskLevel: observation.iRiskLevel,
            ActionReq:observation.sActionReq,
            ActionBy:observation.iActionBy,
            TargetDate:formatDate(observation.TargetDate),
            empCode:observation.iTransDtId
          }));
    
    setFormData({
      project: resultDataArray.Header[0].iProject,
      projectDetails: resultDataArray.Header[0].sProjectDes,
      location: resultDataArray.Header[0].sLocation,
      date: formattedDate,
      observations: observations,
    });
    
      
    } catch (error) {
      setiTransIdSelected(0)
      
    }

  }

   const  handleNewProject = () =>{
    setFormData({
      project: '',
      projectDetails: '',
      location: '',
      date: '',
      observations: [{}],
    });
    setprojecExist(false)
    setiTransIdSelected(0)
    const updatedEditableRows = [...editableRows];
    updatedEditableRows[0] = true;
    setEditableRows(updatedEditableRows);
    

   }
     
   const handleEditButtonClick = (index) => {
    const updatedEditableRows = [...editableRows];
    updatedEditableRows[index] = true;
    setEditableRows(updatedEditableRows);
  };
  const handleDeleteButtonClick = (index) => {
    const updatedObservations = formData.observations.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      observations: updatedObservations,
    });
  };
  

    
    
  

  

  return (
    <div className='homeMain'>
        <form onSubmit={handleSubmit}>
      <div className='homeCard1'>
        <h1>HSE OBSERVATION FORM</h1>
       {iTransIdList &&
        <select className='selectProject' value={iTransIdSelected || 0} onChange={(e) =>
          handleITransIdChange(e)
        } >
           <option value={0} disabled>Select TransId</option>
        {iTransIdList.map(id => <option key={id} value={id}>{id}</option>)}

          </select>
          }
        
        <div className='HC1DM'>
          
        <input className='headInput' placeholder='Project' type={projecExist?"text":'number'} name='project' value={formData.project} onChange={handleInputChange}/>
        <input className='headInput' placeholder='Project Details' name='projectDetails'value={formData.projectDetails} onChange={handleInputChange}/>
        <input className='headInput' placeholder='Location' name='location'value={formData.location} onChange={handleInputChange}/>
        <div className='dateContainer' >
        <input className='headInputDate'  type='Date' name='date'value={formData.date} onChange={handleInputChange}/>
        <span className='dateSpan'>Date</span>

        </div>
    
        
        </div>
        


      </div>  
      <div className='homeCard2'>
        <h5 className='HC2h5'>General Condition</h5>
       
         <div className='HCTMain'>
           
            <table className="GCTable"  >
                <thead>
                    <tr>
                    <th>*</th>
                    <th>SL No</th>
                    <th>Observations/Findings</th>
                    <th>Risk Level</th>
                    <th>Action Required</th>
                    <th>Action By</th>
                    <th>Employee Code</th>
                    <th>Target Date</th>
                    </tr>
                </thead>
                <tbody>
                {formData.observations.map((observation, index) => {

                   
                     
                        return (
                    <tr key={index}>
                    <td>
                        {editableRows[index] ?( 
                          <input
                            type="checkbox"
                            checked={checkedCheckboxes[index]}
                            onChange={() => handleCheckboxChange(index)}
                          />
                        ) :( <div className='buttonsDiv'>
                          <IconButton onClick={() => handleEditButtonClick(index)}><EditIcon id='editIcon'/></IconButton>
                          <IconButton onClick={() => handleDeleteButtonClick(index)}><DeleteIcon id='deleteIcon'/></IconButton></div>
                        )  }
                      </td>
                    <td style={{textAlign: 'center'}}> {index+1}</td>
                    <td><input value={observation.Observation || ''}  name='Observation' onChange={(e) =>
                          handleObservationChange(index,e)} disabled={!editableRows[index]}/></td>
                    <td><select  value={observation.RiskLevel || ''}  name='RiskLevel' onChange={(e) =>
                          handleObservationChange(index,e)} disabled={!editableRows[index]}>
                    <option value='' disabled>Select</option>
                    <option value='1'>Low</option>
                    <option value='2'>Medium</option>
                    <option value='3'>High</option>
                   
                    </select>
                    </td>
                    
                    <td><input value={observation.ActionReq || ''} name='ActionReq' onChange={(e) =>
                          handleObservationChange(index,e)} disabled={!editableRows[index]}/></td>
                    <td><input value={observation.ActionBy || ''} name='ActionBy' type='number' onChange={(e) =>
                          handleObservationChange(index,e)} disabled={!editableRows[index]}/></td>
                    <td><input value={observation.empCode || ''} name='empCode' onChange={(e) =>
                          handleObservationChange(index,e)} disabled={!editableRows[index]}/></td>
                    <td><input value={observation.TargetDate || ''} name='TargetDate' type='Date' onChange={(e) =>
                          handleObservationChange(index,e) } disabled={!editableRows[index]}/></td>
                    </tr> 
                    );
                 
                 
                })}
                    
                  
                    
                    
                
                </tbody>
            </table>
            
            
        </div>
        
        
        <button className='addRow' type='button' onClick={addRow}>
          Add Observation
        </button>
        {editableRows.some((editable) => editable) && (
          <button className='addRow' type='button' onClick={handleDelete}>
            Delete
          </button>
        )}
        {/* <button className='addRow' type='button' onClick={handleDelete}>
            Delete
          </button> */}
      </div> 
      <div className='LastButtons'>
        <button className='submitButton' type='submit'>Save</button>
        

      </div>
      
      </form>
      <button className='newProjectButton' onClick={handleNewProject}>New Project</button>
    </div>
  )
}

export default Home