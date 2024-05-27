import { Button, Column, DataGrid, Editing, Export, Item, Paging, SearchPanel, Toolbar } from 'devextreme-react/data-grid';
import { Pager } from 'devextreme-react/tree-list';
import CustomStore from 'devextreme/data/custom_store';
import React, { useRef, useState } from 'react';
import Header from '../../Header/Header';
import ComplianceMasterDataNavbar from '../ComplianceMasterDataNavBar/ComplianceMasterDataNavbar';
import 'devextreme/dist/css/dx.light.css';
import { Popup } from 'devextreme-react/popup';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from 'react-helmet';
import { getLearnTopic } from '../../../../Apis/Auth/auth';
import AddCalendarDetails from './AddCalendar';
import Moment from 'moment';
// import DeleteLearnTopic from './DeleteLearnTopic';
import { ScrollView } from 'devextreme-react';
import FiduciaryFooterSecondary from '../../../Fiduciary/FiduciaryFooter/FiduciaryFooterSecondary';
import FiduicaruAdminDashboardNavbar from '../../../Fiduciary/FiduciaryDashboard/FiduciaryAdminDashboardNavBar';
import CalendarDetails from './CalendarDetails';


// --------------------------Learn Topics LANDING PAGE COLUMNS AS PER SPECS 5.21.2023--------------------------------------------------//

const isNotEmpty = (value) => {
  return value !== undefined && value !== null && value !== "";
}

const LearnTopicsData = new CustomStore({
  key: 'id',

  load(loadOptions) {
    let params = "?";
    [
      "skip",
      "take",
      "requireTotalCount",
      "requireGroupCount",
      "sort",
      "filter",
      "totalSummary",
      "group",
      "groupSummary",
      "isLoadingAll"
    ].forEach((i) => {
      if (i in loadOptions && isNotEmpty(loadOptions[i])) {

        if (i === "skip") {
          let page = (loadOptions[i] + 10) / 10;
          if (page !== 1) {
            params += `page=${page}&`;
          }
        } else if (i === "sort") {
          let sortType = loadOptions[i][0]["desc"] ? "desc" : "asc";
          let sortColoumn = loadOptions[i][0]["selector"];
          params += `sortType=${sortType}&sortColoumn=${sortColoumn}&`;
        } else if (i === "filter") {
          let filterO = loadOptions[i][0]["filterValue"];
          params += `s=${filterO}&`;
        } else {
          params += `${i}=${JSON.stringify(loadOptions[i])}&`;
        }
      }
    });
    params = params.slice(0, -1);
    // console.log(params)
    if (params == null) return
    return getLearnTopic(params)
      .then((data) => ({
        data: data.data.results,
        totalCount: data.data.count
      }));
  },

});

const Calendar = (props) => {

  const gridRef = useRef();

  const [state, setState] = useState({
    isPopupAddVisible: false,
    hidePopup: false,
    isPopupUpdateVisible: false,
    isPopupVisibleDelete: false,
    deleteID: ''
  })
  // 
  const [selectedId, setSelectedId] = useState(null)

  const [Calendar, setCalendarState] = useState({
    id: "",
    isUpdate: false,
    popUpTitle: "Add Calendar Details",
  })

  const [fk_parent_id, setFK] = useState("")

  const [updatecalendar, setUpdatecalendar] = useState({
    id: "",
    item_name: "",
    secondary_title:"",
    status: "",
    select_calendar_date:"",
    latest_verified_date:"",
    isUpdate: true,
    popUpTitle: "Update Calendar Details",

  })


  const hideClose = (e) => {
    setState({
      isPopupAddVisible: false,
      isPopupUpdateVisible: false
    });
    setFK("")

  }

  const showInfo = (e) => {
    setState((values) => ({
      ...values,
      isPopupAddVisible: true,
    }))

  }

  const refreshGrid = () => {
    gridRef.current.instance.refresh();
  }

  const showUpdateInfo = async (data) => {
    setState((values) => ({
      ...values,
      isPopupUpdateVisible: true
    }));



    setFK(data.row.data.id);
  }
  // useEffect(()=>console.log(fk_parent_id),[fk_parent_id])


  const renderGridCell = (data) => {
    return <a
      href="#"
      onClick={() => showUpdateInfo(data)}
    >{data.value} </a>;
  }
  const formatInceptionDate = (data) => {
    return Moment(data.value).format('MM/DD/YYYY')
  }

  const hideInfo = (e) => {
    setState({
      isPopupAddVisible: false,
      isPopupUpdateVisible: false
    });
  }



  const showPopup = (e) => {
    setState({
      isPopupUpdateVisible: true,
      // updateButtonClicked: true
    });
    setFK(e.row.data.id)
  }
  const showPopupDelete = (e) => {
    console.log(e)

    setState({ deleteID: e.row.data.id, isPopupVisibleDelete: true })
    console.log(e.row.data.id)

  }



  // const setPopupTitle = (newValue) => {

  //   if (state.isPopupUpdateVisible) {
  //     setUpdateLearnTopics((values) => ({
  //       ...values,
  //       popUpTitle: newValue
  //     }))
  //   } else {
  //     setLearnTopicsState((values) => ({
  //       ...values,
  //       popUpTitle: newValue
  //     }))
  //   }

  // }

  const setForeignKey = async (fk) => {
    await setFK(fk);

  }

  /**
   * Setting Key value {id} for DELETE.
   * Call for <DeleteClients />
   * @param {DELETE} e 
   */


  const deleteFirm = (e) => {
    if ((e.row.data.order_id.filter(order_id => order_id.is_deleted !== 1)).length === 0) {
      setState({ deleteID: e.row.data.id, isPopupVisibleDelete: true })

    } else {
      toast.error('Firm has order, cannot delete.', { position: "top-right", autoClose: 5000, toastId: 'success1', pauseOnFocusLoss: false, pauseOnHover: false })
      return false

    }
  }
  /** */
  const concat = (rowData) => {
    return "HCR Firm # " + rowData.id;
  }

  // --------------------------------------------------------- Select Actions to Edit Learn Topics------------------------------------------------------


  // Item can ONLY be either a Major Category or Subcategory Item = Yes  
  // - If Major Category = Yes;  Subcategory = No   (and vice versa)

  // If Major Category = Yes, then Major Category Must be entered
  // If Major Category = No, cannot select a Major Category (since it is not applicable)

  return (
    <section style={{
      minHeight: "calc(100% - 0px)", backgroundColor: "#2B4B60"
    }}>
      <Helmet>
        <title>HCR | Calendar</title>
      </Helmet>

      <Header></Header>
      <div className="card fiduciary_card" style={{ backgroundColor: "#eeeeee", borderRadius: "15px 0px 0px 0px", padding: "2% 7%", paddingBottom: "0px" }}>
        {/* <div>
          <button className='Go-back-button-box mt-3' id="add_firms" onClick={() => props.history.push("/home")}>
          {'<<  Go Back'}
          </button>
        </div> */}
        <div className="card-body" style={{ minHeight: "calc(100vh - 0px)" }}>

          <ComplianceMasterDataNavbar></ComplianceMasterDataNavbar>

          <DataGrid
            id="gridContainer"
            className='client-rw-inline-height'
            // dataSource={CalendarData}
            keyExpr="id"
            ref={gridRef}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={true}
            showBorders={true}
            remoteOperations={true}
            wordWrapEnabled={true}
          >
            <Pager
              visible={true}
              displayMode="full"
              showInfo={true}
              showNavigationButtons={true} />
            <Paging defaultPageSize={10} />
            <SearchPanel
              visible={true}
            />
            <Export
              enabled={true}
              fileName="Learn Topics"
            />
            <Toolbar>
              <Item name="searchPanel" locateInMenu="auto" />
              <Item name="addRowButton" locateInMenu="auto" />
              <Item name="exportButton" locateInMenu="auto" />
              <Item location="after" locateInMenu="auto" >
                <button className='Add-order-button-box' onClick={showInfo}>+ Date</button>
              </Item>
            </Toolbar>
            <Editing
              mode="row"
              allowAdding={false}
              useIcons={true}
            />
            <Column
              caption="Item Name"
              dataField="item_name"
              alignment={"center"}

            />
            <Column
              caption="Secondary Title"
              dataField="secondary_title"
              alignment={"center"}
            />
            <Column
              caption="Date"
              dataField="date"
              alignment={"center"}
            />
            <Column
              caption="Status"
              dataField="status"
              alignment={"center"}
            />

            <Column type="buttons" dataField="Actions" width={110}>
              <Button icon="edit" hint="Edit" onClick={showPopup} />
              <Button icon="trash" hint="Delete" onClick={showPopupDelete} />

              {/* <Button hint="Clone" icon="copy" visible={this.isCloneIconVisible} disabled={this.isCloneIconDisabled} onClick={this.cloneIconClick} /> */}
            </Column>
          </DataGrid>

          {state.isPopupUpdateVisible && <Popup
            visible={state.isPopupUpdateVisible}
            onHiding={hideClose}
            dragEnabled={false}
            onClosePop={hideClose}
            showCloseButton={true}
            onCancelPop={hideClose}
            showTitle={true}
            title="Update Calendar Details"
            width={700}
            height="auto"
          ><ScrollView width='100%' height='100%'>
              <AddCalendarDetails
                sendFk={state.isPopupUpdateVisible ? "": ""}
                // data={updateLearnTopics}
                onClosePop={hideClose}
                onSave={refreshGrid}
                onCancelPop={hideClose}
                onSetFk={setForeignKey}
                // onChangeTitle={setPopupTitle}
              ></AddCalendarDetails>
            </ScrollView>
          </Popup>}


          {state.isPopupAddVisible && <Popup
            visible={state.isPopupAddVisible}
            onHiding={hideClose}
            dragEnabled={false}
            onClosePop={hideClose}
            onCancelPop={hideClose}
            showCloseButton={true}
            showTitle={true}
            title=" Add Compliance Calendar Date"
            width={700}
            height="auto"
          ><ScrollView width='100%' height='100%'>
              <AddCalendarDetails
                sendFk={''}
                data={Calendar}
                onClosePop={hideClose} 
                onCancelPop={hideClose}
                onSave={refreshGrid}
                onSetFk={setForeignKey}
                // onChangeTitle={setPopupTitle}
              ></AddCalendarDetails>
            </ScrollView>
          </Popup>}

          {state.isPopupVisibleDelete && <Popup
            visible={state.isPopupVisibleDelete}
            onHiding={hideClose}
            dragEnabled={false}
            showCloseButton={true}
            showTitle={true}
            title="Delete Learn Topics"
            width={500}
            height="auto"
          > 
          {/* <DeleteLearnTopic
            data={state}
            onClosePop={hideClose}
            onRefresh={refreshGrid}
          ></DeleteLearnTopic> */}
          </Popup>}

        </div>
        <FiduciaryFooterSecondary />
      </div>

    </section>
  )
}
export default Calendar;