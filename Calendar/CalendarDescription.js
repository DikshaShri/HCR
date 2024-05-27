import React, { useCallback, useEffect, useState } from "react";
import "../ComplianceProducts/ComplianceProducts.css";
import { Editor } from "@tinymce/tinymce-react";
import { GET, POST, PUT } from "../../../../Apis/config/RequestType";
import Caller from "../../../../Apis/config/Caller";
import { API_LEARN_TOPIC } from "../../../../Apis/config/Url";
import { ProgressBar } from 'react-loader-spinner'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "devextreme/dist/css/dx.light.css";


// Get the data from the Learn Topics as props//

const CalendarDescription = (props) => {
  let jsonFk = JSON.parse(JSON.stringify(props.fk));

  const [loader, setLoader] = useState(true);
  const [allValues, setAllValues] = useState({
    id: "",
    content: "",
    video_url: "",
    title: "",
    productValues: [],
    disabledSave: '',

  });

  const [allErrors, setAllErrors] = useState({

    video_url: ""
  });


  // Retrieve data from the Learn Topics

  const getData = useCallback(async (id) => {
    await Caller(API_LEARN_TOPIC + '?pk=' + id, '', GET, false).then(data => {
      setAllValues((prev) => ({
        ...prev, learn_item_name: data.data.learn_item_name, surveys: data.data.surveys,
        major_category_item: data.data.major_category_item, major_category: data.data.major_category, status: data.data.status,
        title: data.data.title, subcategory: data.data.subcategory, video_url: data.data.video_url, content: data?.data?.content == "null" ? "" : data?.data?.content
      }))
    });
    setLoader(false);
  }, [])

  useEffect(() => {
    if (props.fk) {
      getData(props.fk)
    }
  }, [getData, props])



  const textUpdate = (e) => {
    setAllErrors((values) => ({
      ...values,
      [`${e.target.name}`]: "",
    }))
    setAllValues((allValues) => ({ ...allValues, [`${e.target.name}`]: e.target.value }));
  };
  const textUpdateURL = (e) => {
    let re = /./;
    if (e.target.value === '' || re.test(e.target.value)) {
      setAllErrors((values) => ({
        ...values,
        [`${e.target.name}`]: "",
      }))
      setAllValues((allValues) => ({ ...allValues, [`${e.target.name}`]: e.target.value }));
    }
  };




  const textValue = (content, editor) => {
    setAllValues((allValues) => ({ ...allValues, content: content }));
  };


  // Save the data provided in the description tab 

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
    formData.append('title', allValues.title)
    formData.append('content', allValues?.content === "null" ? " " : allValues?.content == null ? "" : allValues?.content)
    formData.append('video_url', allValues.video_url)

    switch (props.data.isUpdate) {
      case true:
        await Caller(API_LEARN_TOPIC + '?pk=' + jsonFk, formData, PUT, false, true)
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
              // props.setId(data.data?.id)            
              // props.changeTab(2)
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

console.log(props)
  // const Alltrue = () => {
  //   if (allValues.product_name && allValues.surveys && allValues.news && allValues.status) {
  //     return false
  //   }
  //   return true
  // }

  return (
    <section className="padding-20">
      {loader && <div className='alert alert-light my' style={{ padding: "250px" }}>
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
        className="needs-validation"
        noValidate
        onSubmit={saveUser}
      >


        <div class="form-group col-md-12 subject-group">
          <p class="form-control-label email-subject-left" for="l0" style={{ display: "inline", paddingRight: "16%", marginLeft: "2%" }}>
            Title
          </p>
          <input
            type="text"
            id="validationCustom03"
            className="form-control"
            name="title"
            value={allValues.title}
            maxLength="200"
            onChange={textUpdate}
            style={{ maxWidth: "65%", display: "inline" }}
          />

        </div>
        <div class="form-group col-md-12 subject-group">
          <p for="10" className="form-control-label email-subject-left" style={{ display: "inline", paddingRight: "10%", marginLeft: "2%" }}>Video URL</p>
          <input type="text" id="video_url" onChange={textUpdateURL} className="form-control " placeholder="video_url " maxLength="500" name={'video_url'} value={allValues.video_url} style={{ maxWidth: "65%", display: "inline" }} />
          <span className="invalid-feedback">
            Invalid Video URL.
          </span>

        </div>

        <div className="col-md-12">
          <div class="form-group col-md-12 subject-group">
            <p class="form-control-label email-subject-left" for="l0" style={{ marginLeft: "2%" }}>
              Content
            </p>
            <div class="" style={{ marginLeft: "2%" }}>
              <Editor
                id="validationCustom03"
                required
                name="content"
                value={allValues.content}
                init={{
                  relative_urls: false,
                  remove_script_host: false,
                  height: 300,
                  plugins: 'advlist autolink autosave link image lists charmap print preview hr anchor pagebreak table searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking table contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker textpattern',
                  menubar: true,
                  directionality: "ltr",
                  statusbar: false,
                  font_formats: 'Arial=arial,helvetica,sans-serif; Courier New=courier new,courier,monospace; AkrutiKndPadmini=Akpdmi-n',
                  toolbar1:
                    "undo redo insert | blocks | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | link image preview media | fontfamily fontsize | forecolor backcolor emoticons codesample help",
                }}
                onEditorChange={textValue}
              />


            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="col-md-12 floating-right-bg ">
            <button type="submit" className={`btn btn-success width-success `}>
              {props.data?.isUpdate ? 'Update ' : 'Save'}
            </button>
            <button
              type="button"
              className="btn btn-warning set-margin width-success"
              onClick={() => props.onClose()}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>}
    </section>

  )
}
export default CalendarDescription;

