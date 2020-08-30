import React from "react";
import "./fileDragger.css";
import FileUploadNew from "../fileUploadNew/fileUploadNew";
import proptype from "prop-types";

function FileDragger(props) {
  return (
    <div className="file-dragger">
      <div className="content-dragger">{props.children}</div>
      <FileUploadNew
        className="file-dragger-inner"
        dragger
        onChange={props.onChange}
        multiple={props.multiple}
        validImageTypesSrc={props.validImageTypesSrc}
        fileName={props.fileName}
        method={props.method}
        uploadUrl={props.uploadUrl}
        token={props.token}
        deleteUrl={props.deleteUrl}
        fileIdToRemove={props.fileIdToRemove}
        updateTrigger={props.updateTrigger}
        removeTrigger={props.removeTrigger}
        maxUpload={props.maxUpload}
        disabled={props.disabled}
        fileList={props.fileList}
      />
    </div>
  );
}

FileDragger.defaultProps = {
  multiple: true,
  validImageTypesSrc: ["gif", "jpeg", "png", "jpg"],
  fileName: "file",
  method: "post",
  uploadUrl: "",
  deleteUrl: "",
  token: "",
  onChange: () => null,
  updateTrigger: () => null,
};

FileDragger.propType = {
  multiple: proptype.bool,
  validImageTypesSrc: proptype.array,
  fileName: proptype.string,
  method: proptype.string,
  uploadUrl: proptype.string,
  deleteUrl: proptype.string,
  token: proptype.string,
  onChange: proptype.func,
  fileIdToRemove: proptype.any,
  updateTrigger: proptype.func,
  removeTrigger: proptype.bool,
  maxUpload: proptype.number,
  disabled: proptype.bool,
  fileList: proptype.array,
};

export default FileDragger;
