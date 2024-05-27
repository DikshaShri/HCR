import React, { useEffect, useRef } from "react";
import '../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { API_LEARN_TOPIC } from "../../../../Apis/config/Url";
import "react-toastify/dist/ReactToastify.css";
import { DELETE } from "../../../../Apis/config/RequestType";
import Caller from "../../../../Apis/config/Caller";
import { toast } from "react-toastify";

// --------------------------Learn Topic ALL DATA  DELETE POPUP AS PER SPECS 5.21.2023--------------------------------------------------//

export default function DeleteLearnTopic(props) {

    // calling DataDataApiCall for DELETE
    const innerRef = useRef();
    useEffect(() => innerRef.current && innerRef.current.focus());
    const deleteProduct = async () => {
        const formData = new FormData();
        formData.append("is_deleted", 1);


        await Caller(API_LEARN_TOPIC + '?pk=' + props.data.deleteID, formData, DELETE, false, true)
            .then((data) => {
                if (data.success === true) {
                    toast.success('Learn Topic Deleted Successfully', { position: "top-right", autoClose: 2000 });
                }
                else {
                    toast.error(data.message, { position: "top-right", autoClose: 5000, pauseOnFocusLoss: false, pauseOnHover: false });
                }
                props.onRefresh();
                props.onClosePop();
            });

    }
    return (
        <div className="">
            <div className=' '>
                <section className="body-color bg-color overflow-none ">
                    <div className=" col-md-12 ">
                        <div className="top-border">Do you want to delete this Learn Topic?</div>
                    </div>
                    <div className=" row button-style">
                        <div className="col-md-6 text-align-center"><button type="button" class="btn-del buttons-save" onClick={deleteProduct}>
                            <b> Yes</b>
                        </button></div>
                        <div className="col-md-6 text-align-center"><button type="button" class=" btn-del buttons-save background-color" autofocus onClick={() => props.onClosePop()}>
                            <b> Cancel</b>
                        </button></div>
                    </div>
                </section>
            </div>
        </div>
    );
}