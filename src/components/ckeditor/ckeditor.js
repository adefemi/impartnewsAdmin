import React from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./ckeditor.scss";
import proptype from "prop-types";
import Axios from "axios";

class UploadAdapter {
  constructor(loader, uploadUrl) {
    this.loader = loader;
    this.upload = this.upload.bind(this);
    this.abort = this.abort.bind(this);
    this.uploadUrl = uploadUrl;
  }

  async upload() {
    const data = new FormData();
    let fileData = await this.loader.file;
    data.append("file", fileData);

    return Axios({
      url: this.uploadUrl,
      method: "post",
      data,
    })
      .then((res) => {
        console.log(res);
        var resData = res.data;
        resData.default = resData.file;
        return resData;
      })
      .catch((error) => {
        console.log(error);
        return Promise.reject(error);
      });
  }

  abort() {
    // Reject promise returned from upload() method.
  }
}

function Ckeditor(props) {
  return (
    <div className="cke-main">
      <CKEditor
        editor={ClassicEditor}
        data={props.value}
        onInit={(editor) => {
          editor.plugins.get("FileRepository").createUploadAdapter = function (
            loader
          ) {
            return new UploadAdapter(loader, props.uploadUrl);
          };
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          if (props.onChange) {
            props.onChange(data);
          }
        }}
        onBlur={(event, editor) => {
          if (props.onBlur) {
            props.onBlur(event);
          }
        }}
        onFocus={(event, editor) => {
          if (props.onFocus) {
            props.onFocus(event);
          }
        }}
      />
    </div>
  );
}

Ckeditor.propTypes = {
  value: proptype.any,
  onChange: proptype.func.isRequired,
  onBlur: proptype.func,
  onFocus: proptype.func,
  uploadUrl: proptype.string,
};

export default Ckeditor;
