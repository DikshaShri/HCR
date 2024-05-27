import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import CalendarDetails from './CalendarDetails'
import CalendarDescription from './CalendarDescription';
import "./Calendar.css";

// ----------------------------------------------------LEARN TOPIC SUBTAB POPUP-------------------//

const AddCalendarDetails = (props) => {
  
  let jsonProps = JSON.parse(JSON.stringify(props.data));
  let jsonFk = JSON.parse(JSON.stringify(props.sendFk));

  let isdisable = true
  if (jsonFk)
   {isdisable=false}

  const [allVisibleValues, setAllVisibleValues] = useState(false);

  const [id,setId] = useState(null)
  

  const check = (value) => {
    if (value === false) {
      setAllVisibleValues(false)
    } else {
      setAllVisibleValues(true)
    }
  }

  const [key, setKey] = useState(1);
  const close = (e) => props.onClosePop();
  const refresh = (e) => props.onSave();
  const foreignKey = (e) => {
    props.onSetFk(e);
  };
  const set = (key) => {
    switch (key) {
      case "1":
        props.onChangeTitle(jsonFk ? "Update Calendar Detail":"Add Calendar Details")
        break;
      case "2":
        props.onChangeTitle("Calendar Description")
        break;

      default:
        break;
    }
  }
// If new data is added only details tab will be visible only on updation when leearn topic id is passed as jsonFk  Description will be shown

  return (
    <section className='body-color bg-color '>
      <div className="max-width-sections">
        <div className="col-md-12 middle-outer-div bg-white">
          <Tabs
            activeKey={key}
            onSelect={(k) => { setKey(k); set(k); }}
            id="complianceProductNavbarTab"
            className="firmNavbarTab"
          >
            <Tab eventKey="1" title="Details" >
              <CalendarDetails data={jsonProps} setId = {setId} fk={jsonFk} changeTab={(k) => { setKey(k) }} onClose={close} checkValidity={check} onRefresh={refresh} setForeignId={foreignKey} />
            </Tab>

            {jsonFk && <Tab eventKey="2" title="Description" >
              <CalendarDescription data={jsonProps} fk={jsonFk} changeTab={(k) => { setKey(k) }} onClose={close} checkValidity={check} onRefresh={refresh} />
            </Tab>}
          </Tabs>
        </div>
      </div>
    </section>
  )
}

export default AddCalendarDetails;
