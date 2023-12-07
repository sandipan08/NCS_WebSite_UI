import React from 'react';
import { Form, Col, OverlayTrigger, Popover } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function TextField({ field, value, isViewMode, index, register, errors, changeHandler, blurHandler }) {
    // console.log(field?.label)

    return (
        <Form.Group key={index} as={Col} md={field?.placedIn == "modal" ? "12" : "4"} className="p-0 m-0">
            {field?.page ? " " : <OverlayTrigger trigger="click" rootClose placement="auto" overlay={<Popover id="popover-basic">
                <Popover.Header as="h3">Field Description</Popover.Header>
                <Popover.Body>
                    {field?.description ? field?.description : "No description found!"}
                </Popover.Body>
            </Popover>}>
                <Form.Label className="m-0" style={{ fontSize: "12px" }}>{field?.label}</Form.Label>
            </OverlayTrigger>}

            <Form.Control size='sm' style={field?.page ? { width: '250px' } : { maxWidth: '400px' }} // input
                // readOnly={isViewMode}
                // plaintext={isViewMode}
                disabled={field?.disabled}
                type={field?.type ? field.type : "text"}
                id={field?.fieldId}
                name={field?.fieldId}
                value={value}
                placeholder={field?.placeholder}
                isInvalid={errors[field?.fieldId]}
                {...register(field?.fieldId,
                    {
                        required: field?.required ? field?.validationMessage : false,
                        onBlur: (event) => blurHandler && blurHandler(event, { type: field?.type, id: field?.fieldId }),
                        onChange: (event) => changeHandler && changeHandler(event, { type: field?.type, id: field?.fieldId, targetValue: event.target?.value })
                    })}
            />


            <Form.Control.Feedback type="invalid">
                {errors[field?.fieldId] && errors[field.fieldId]['message']}
            </Form.Control.Feedback>

        </Form.Group>
    )
}
