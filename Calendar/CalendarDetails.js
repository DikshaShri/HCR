import React, { useCallback, useEffect, useState } from 'react';
import Caller from '../../../../Apis/config/Caller';
import { GET, POST, PUT } from '../../../../Apis/config/RequestType';
import { API_LEARN_TOPIC, API_MAJOR_CATEGORY_DATA } from '../../../../Apis/config/Url';
import "../ComplianceProducts/ComplianceProducts.css";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ProgressBar } from 'react-loader-spinner'
import DatePicker from "react-datepicker";
import moment from 'moment';


// --------------------------COMPLIANCE PRODUCT DETAILS TAB  AS PER SPECS 5.21.2023--------------------------------------------------//

const CalendarDetails = (props) => {
  const [loader, setLoader] = useState(true);
  const [allValues, setAllValues] = useState({
    id: "",
    item_name: "",
    secondary_title: "",
    select_calendar_date:"",
    status: "",
    latest_verified_date:"",
    disabledSave: '',
  });

  const [allErrors, setAllErrors] = useState({
    item_name: "",
    secondary_title: "",
    select_calendar_date:"",
    status: "",
    latest_verified_date:"",
  });

  // New
  const majorCategoryData = useCallback(async () => {
    await Caller(API_MAJOR_CATEGORY_DATA, '', GET, false, true).then(data => {
      setAllValues((prev) => ({
        ...prev,
        major_category_data: data.data
      }))
    });
    setLoader(false);
  }, [])

  const getData = useCallback(async (id) => {
    await Caller(API_LEARN_TOPIC + '?pk=' + id, '', GET, false, true).then(data => {
      setAllValues((prev) => ({
        ...prev, learn_item_name: data.data.learn_item_name, surveys: data.data.surveys,
        major_category_item: data.data?.major_category_item,
        major_category_id: data.data.major_category, status: data.data.status, federal: data.data.federal, state: data.data.state,
        title: data.data.title, subcategory: data.data.subcategory, video_url: data.data.video_url, content: data.data.content
      }))
    });
    setLoader(false);
  }, [])

  useEffect(() => {
    majorCategoryData();
    if (props.fk) {
      getData(props.fk)
    }
  }, [getData, majorCategoryData, props])



  var isDate = function (date) {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
  }
  const selectCalendarDateUpdate= (e) => {
    setAllErrors((values) => ({
        ...values,
        select_calendar_date: ""
    }))
    setAllValues((allValues) => ({ ...allValues, select_calendar_date: e }));
  }

  const latestVerifiedDateUpdate= (e) => {
    setAllErrors((values) => ({
        ...values,
        latest_verified_date: ""
    }))
    setAllValues((allValues) => ({ ...allValues, latest_verified_date: e }));
  }


  const textUpdate = (e) => {
    const re = /^[a-zA-Z0-9 ]+$/;
    if (e.target.value === '' || (re.test(e.target.value) && e.target.value.length <= 50)) {
      setAllErrors((values) => ({
        ...values,
        [`${e.target.name}`]: "",
      }))
      setAllValues((allValues) => ({ ...allValues, [`${e.target.name}`]: e.target.value }));
    }
  };

  const textUpdate2 = (e) => {
    const re = /^[a-zA-Z0-9 ]+$/;
    if (e.target.value === '' || (re.test(e.target.value) && e.target.value.length <= 200)) {
      setAllErrors((values) => ({
        ...values,
        [`${e.target.name}`]: "",
      }))
      setAllValues((allValues) => ({ ...allValues, [`${e.target.name}`]: e.target.value }));
    }
  };

  const handleStatus = (event) => {
    setAllValues((values) => ({ ...values, [event.target.name]: event.target.value }))
  }

  // If no data foud then add new data if found any previous data update

  const saveUser = async (event) => {
    event.target.classList.add("was-validated");
    setAllValues({ ...allValues, disabledSave: 'disabled' })
    event.preventDefault();
    event.stopPropagation();

    if (!event.target.checkValidity()) {
      setAllValues({ ...allValues, disabledSave: '' })
      return false;
    }

    const formData = new FormData();
    formData.append('item_name', allValues.item_name)
    formData.append('secondary_title', allValues.secondary_title)
    formData.append('select_calendar_date', allValues.select_calendar_date === undefined || allValues.select_calendar_date === null ? '' : moment(allValues.select_calendar_date).format('yyyy-MM-DD'))
    formData.append('status', allValues.status)
    formData.append('latest_verified_date', allValues.latest_verified_date  === undefined || allValues.latest_verified_date === null ? '' : moment(allValues.latest_verified_date).format('yyyy-MM-DD'))
    

    switch (props.data.isUpdate) {
      case true:
        await Caller(API_LEARN_TOPIC + '?pk=' + props.fk, formData, PUT, false, true)
          .then((data) => {
            if (data.success === true) {

              toast.success(data.message, { position: "top-right", autoClose: 2000 });
              props.onRefresh();
              props.onClose();
            }
            else {
              if (data.errors) {
                setAllValues({ ...allValues, disabledSave: '' })
                for (const [key, value] of Object.entries(data.errors)) {
                  setAllErrors((values) => ({
                    ...values,
                    [`${key}`]: value,
                  }))
                }
              }

              toast.error(data.message, { position: "top-right", autoClose: 5000, pauseOnFocusLoss: false, pauseOnHover: false });
              setAllValues({ ...allValues, disabledSave: '' })
            }
          });
        break;
      case false:
        await Caller(API_LEARN_TOPIC, formData, POST, false, true)
          .then((data) => {
            if (data.success === true) {

              toast.success(data.message, { position: "top-right", autoClose: 2000 });
              props.onRefresh();
              props.onClose();
            }
            else {

              if (data.errors) {
                setAllValues({ ...allValues, disabledSave: '' })
                for (const [key, value] of Object.entries(data.errors)) {
                  console.warn(data.errors[0])
                  setAllErrors((values) => ({
                    ...values,
                    [`${key}`]: value,
                  }))
                }
              }

              toast.error(data.message, { position: "top-right", autoClose: 5000, pauseOnFocusLoss: false, pauseOnHover: false });
            }
          });
        break;
      default:
        break;
    }


  }


  const Alltrue = () => {
    if (allValues.item_name !== '' && allValues.secondary_title !== '' && allValues.select_calendar_date !== '' && allValues.status !== '' && allValues.latest_verified_date !== '') {
      return false
    }
    return true
  }


  return (
    <section className="padding-20">
      {loader && <div className='alert alert-light my' style={{ padding: "120px" }}>
        <ProgressBar
          height="80"
          width="80"
          ariaLabel="progress-bar-loading"
          wrapperStyle={{}}
          wrapperClass="progress-bar-wrapper"
          borderColor='#F4442E'
          barColor='#51E5FF'
        /></div>}

      {!loader && <form
        className="row g-3 needs-validation"
        noValidate
        onSubmit={saveUser}
      >

      <div className="col-md-4">
        <label for="productName" id="validationCustom03" className="form-label text-size-color">Item Name <sup className="red-color">*</sup>
        </label>
        <input type="text" id="ProductName" onChange={textUpdate} className="form-control " placeholder="Item Name " maxLength="50" name={'item_name'} value={allValues.item_name} required />
        <span className="invalid-feedback">
          Item Name is required.
        </span>
        </div>

        <div className="col-md-4">
          <label for="secondary_title" className="form-label text-size-color"> Secondary Title <sup className="red-color">*</sup></label>
          <input type="text" id="secondary_title" onChange={textUpdate2} className="form-control " style={{width:'200%'}} placeholder="Secondary Title" maxLength="200" name={'secondary_title'} value={allValues.secondary_title} required />
          <span className="invalid-feedback">
          Secondary Title is required.
          </span>
        </div>

        <div className="col-md-4"></div>
        <div className="col-md-4">
          <label for="orderdate" id="validationCustom03" className="form-label text-size-color">Select Calendar Date<sup className="red-color">*</sup>
          </label>
          </div>
          <div className="col-md-4">
            <DatePicker
              dateFormat="MM/dd/yyyy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              isInvalid={!!allErrors.select_calendar_date}
              className={allErrors.select_calendar_date ? " form-control is-invalid " : 'form-control plan'}
              selected={allValues.select_calendar_date}
              onChange={selectCalendarDateUpdate}
              placeholderText="mm/dd/yyyy"
              required
              wrapperClassName="style-bloock form-control"
              />
              {!allErrors.select_calendar_date && <span className="invalid-feedback">
                Date is required.
                </span>}
                {allErrors.select_calendar_date && <span style={{ fontSize: "small", color: "#dc3545" }}>
                    {allErrors.select_calendar_date}
                    </span>}
            </div>

        <div className="col-md-4">
          <p className="my-text-size-color-heading"> Status <sup className="red-color">*</sup></p>
          <div className="form-check form-check-inline">
            <label className="form-check-label" for="status_active">
              <input className="form-check-input" type="radio" value="1" name={"status"} id="status_active" checked={allValues.status === '1' || allValues.status === 1 || allValues.status === true} onChange={handleStatus} />
              Active
            </label>
          </div>

          <div className="form-check form-check-inline">
            <label className="form-check-label" for="status_inactive">
              <input className="form-check-input" type="radio" value="0" name={"status"} id="status_inactive" checked={allValues.status === '0' || allValues.status === 0 || allValues.status === false} onChange={handleStatus} />
              Inactive
            </label>
          </div>
        </div>

        
        <div className="col-md-4">
          <label for="orderdate" id="validationCustom03" className="form-label text-size-color">Latest Verified Date<sup className="red-color">*</sup>
          </label>
          </div>
        <div className="col-md-4" >
            <DatePicker
              dateFormat="MM/dd/yyyy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              isInvalid={!!allErrors.latest_verified_date}
              className={allErrors.latest_verified_date ? " form-control is-invalid " : 'form-control plan'}
              selected={allValues.latest_verified_date}
              onChange={latestVerifiedDateUpdate}
              placeholderText="mm/dd/yyyy"
              required
              wrapperClassName="style-bloock form-control"
              style={{borderRadius:"5px"}}
              />
              {!allErrors.latest_verified_date && <span className="invalid-feedback">
                Date is required.
                </span>}
                {allErrors.latest_verified_date && <span style={{ fontSize: "small", color: "#dc3545" }}>
                    {allErrors.latest_verified_date}
                    </span>}
        
        </div>
        
        <div className="col-md-4"></div>

        <div className="col-md-12">
          <div className="col-md-12 floating-right-bg ">
            <button type="submit" className={`btn btn-success width-success ${allValues.disabledSave}`} disabled={Alltrue()}>
              {props.data?.isUpdate ? 'Update ' : 'Save'}
            </button>
            <button
              type="button"
              className="btn btn-warning set-margin width-success"
              onClick={() => props.onClose()}>
              Cancel
            </button>
          </div>
        </div>
      </form>}
    </section>

  )
}

export default CalendarDetails;
