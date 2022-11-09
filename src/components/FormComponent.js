import React from "react";
// const [show, setShow] = useState(false)

const Input = ({
    SizeSM,
    SizeMD,
    SizeLG,
    Mar,
    ForImp,
    TextLabelImp,
    Type,
    IdInp,
    PlaceHolder,
    Disabled,
    Valueinp,
    textStyle,
    StyleLable,
    FuncInp,
    plusClass,
    name,
    required
}) => {
    return (
        <div className={`col-sm-${SizeSM} col-md-${SizeMD} col-lg-${SizeLG}`}>
            <div className={`mb-${Mar}`}>
                <label htmlFor={ForImp} className={`form-label ${StyleLable}`}>
                    {TextLabelImp}
                </label>
                <input
                    type={Type}
                    className={`form-control text-${textStyle} ${plusClass}`}
                    id={IdInp}
                    name={name}
                    placeholder={PlaceHolder}
                    defaultValue={Valueinp}
                    disabled={Disabled}
                    onChange={FuncInp}
                    required={required}
                    autoComplete="off"
                />
            </div>
        </div>
    );
};

const InputLin = ({
    HtmlFor,
    colLabel,
    idInp,
    colInput,
    Valueinp,
    Disabled,
    PlaceHolder,
    LabelText,
    Type,
    Style,
    textStyle,
    funcInp,
    PaddingTop,
    heightInp,
    fontSizeInp,
    name,
    styleInp,
    Width,
    required
}) => {
    //g-3 mb-3
    return (
        <div className="row mb-3">
            <label
                htmlFor={HtmlFor}
                className={`col-${colLabel} col-form-label ${Style}`}
                style={{ paddingTop: PaddingTop, maxWidth: Width}}
            >
                {LabelText}
            </label>
            <div className={`col-${colInput} ${styleInp}`}>
                <input
                    type={Type}
                    id={idInp}
                    name={name}
                    className={`form-control text-${textStyle}`}
                    aria-describedby="com"
                    defaultValue={Valueinp}
                    disabled={Disabled}
                    placeholder={PlaceHolder}
                    onChange={funcInp}
                    style={{ height: heightInp, fontSize: fontSizeInp }}
                    required={required}
                    autoComplete="off"
                />
            </div>
        </div>
    );
};

const Textarea = ({
    SizeSM,
    SizeMD,
    SizeLG,
    Mar,
    ForArea,
    TextLabelTextArea,
    IdTextArea,
    Row,
    Valueinp,
    Disabled,
    FuncArea,
    PlaceHolder,
    name,
    StyleLable,
    required
}) => {
    return (
        <div className={`col-sm-${SizeSM} col-md-${SizeMD} col-lg-${SizeLG}`}>
            <div className={`mb-${Mar}`}>
                <label htmlFor={ForArea} className={`form-label ${StyleLable}`} style={{ marginTop: '0px'}}>
                    {TextLabelTextArea}
                </label>
                <textarea
                    className="form-control"
                    id={IdTextArea}
                    defaultValue={Valueinp}
                    rows={Row}
                    name={name}
                    placeholder={PlaceHolder}
                    disabled={Disabled}
                    required={required}
                    onChange={FuncArea}
                    autoComplete="off"
                ></textarea>
            </div>
        </div>
    );
};

const FormComponent = {
    Input,
    Textarea,
    InputLin,
};

export default FormComponent;
