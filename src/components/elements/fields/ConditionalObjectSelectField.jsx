
import axios from 'axios';
import { React, useState, useEffect } from 'react';
import { Form, Col, OverlayTrigger, Popover } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Controller } from 'react-hook-form';
import { IoCheckmark, IoCloseOutline } from "react-icons/io5";
import ApiService from '../../../helpers/ApiServices';


export default function ConditionalObjectSelectField({ control, field, states, errors, queryPath, index, multiple, changeHandler, blurHandler }) {
    const [state, setState] = useState([]);
    const [selected, setSelected] = useState([]);

    const getList = async () => {
        if (field?.selectRecordType.includes("/")) {

            ApiService.setHeader();
            const response = await ApiService.get(`/${field?.selectRecordType}`);
            // console.log(response.data.documents);
            if (response.data.isSuccess) {
                if (response.data?.document?.options) {
                    // console.log(response.data?.document.options);
                    setState(response.data?.document.options)
                } else {
                    setState(response.data?.documents)
                }

            }
        }
    }

    const convertObjectToArray = (obj) => {
        if (!obj) return [];

        const arr = [];
        arr.push(obj)
        // console.log(arr);
        return arr;
    }

    useEffect(() => {
        // if (field.selectRecordType) {
        getList();
        // }
    }, []);


    return <Form.Group key={index} as={Col} md={field?.placedIn == "modal" ? "12" : "4"} className="mb-2">
        <OverlayTrigger trigger="click" rootClose placement="auto" overlay={<Popover id="popover-basic">
            <Popover.Header as="h3">Field Description</Popover.Header>
            <Popover.Body>
                {field?.description ? field?.description : "No description found!"}
            </Popover.Body>
        </Popover>}>
            <Form.Label className="m-0">{field?.label}</Form.Label>
        </OverlayTrigger>

        <Controller
            name={field?.fieldId}
            control={control}
            rules={{ required: field?.required ? field?.validationMessage : false }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Typeahead key={index} size='sm' className='is-invalid' style={{ maxWidth: '400px' }}
                    id="pct_objectSelect_typeahead"
                    clearButton
                    isInvalid={errors[field?.fieldId]}
                    labelKey={option => {
                        if (option.text) return `${option?.text}`
                        if (option.name) return `${option?.name}`
                        if (option.name == "" || option.text == "") return ``
                    }}
                    multiple={field?.multiple}
                    disabled={field?.disabled}
                    onChange={(event) => {

                        if (event.length === 0) {
                            onChange(null)
                            // console.log(event)
                        } else {
                            // console.log("event", event)
                            onChange(Object.assign({}, ...event)); // []-> {}
                        }




                        if (changeHandler) changeHandler(event, { type: field.type, id: field.fieldId, value: event.length > 0 ? event[0] : event })
                    }}
                    // onBlur={(event) =>
                    //     blurHandler && blurHandler(event, { type: field.type, id: field.fieldId, value: value, targetValue: event.target?.value })
                    // }
                    // options={state}
                    options={field?.selectRecordType == "modal" ? states : state}
                    placeholder={field?.placeholder}
                    selected={convertObjectToArray(value)} // {} -> []
                    flip={true}

                >

                </Typeahead>)}
        />
        {errors[field?.fieldId] &&
            <Form.Text className="" style={{ color: '#dc3545' }}>
                {errors[field?.fieldId] && errors[field.fieldId]['message']}
            </Form.Text>
        }

    </Form.Group>;
}
