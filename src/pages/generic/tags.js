import React, { useState, useEffect } from "react";
import Input from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import { Modal } from "../../components/modal/Modal";
import TransactionTable from "../../components/transactionTable/transactionTable";
import FormGroup from "../../components/formGroup/formGroup";
import { getTagList, deleteTag, addTag } from "../requests";
import { Notification } from "../../components/notification/Notification";
import Pagination from "../../components/Pagination/pagination";

function Tags() {
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tag, setTag] = useState("");

  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(1);

  useEffect(() => {
    getTags();
  }, [currentPage]);

  const getTags = async () => {
    setLoading(true);
    let tagContents = await getTagList();
    if (tagContents) {
      console.log(tagContents);
      setTags(tagContents.results);
      setTotal(tagContents.count);
    }
    setLoading(false);
  };

  const onDeleteTag = (slug) => {
    Modal.confirm({
      title: "Delete Confirmation",
      content: "Do you really want to delete this news?",
      onOK: async () => {
        await deleteTag(slug);
        Notification.bubble({
          type: "success",
          content: "Tag successfully deleted",
        });
        getTags();
      },
    });
  };

  const getValue = () => {
    const res = [];

    tags.map((item) => {
      res.push([
        <div>{item.title}</div>,
        <div style={{ maxWidth: 150 }} className="flex align-center">
          <Button color="danger" onClick={() => onDeleteTag(item.id)}>
            Delete
          </Button>
        </div>,
      ]);
      return null;
    });
    return res;
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    let res = await addTag({ title: tag });
    if (res) {
      Notification.bubble({
        type: "success",
        content: "Tag added successfully",
      });
      setShowModal(false);
      getTags();
    }
    setSaving(false);
  };

  return (
    <div>
      <h3>All Tags</h3>
      <div className="flex align-center justify-between">
        <div />
        <Button onClick={() => setShowModal(true)}>ADD TAG</Button>
      </div>
      <br />
      <TransactionTable
        keys={["Tag", "Action"]}
        values={getValue()}
        loading={loading}
      />
      <br />
      {!loading && (
        <>
          <br />
          <Pagination
            total={total}
            current={currentPage}
            onChange={(e) => setCurrentPage(e)}
          />
        </>
      )}
      <br />
      <br />
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Add Tag"
      >
        <form onSubmit={submit}>
          <FormGroup label="Title">
            <Input
              placeholder="Enter tag title"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              required
            />
          </FormGroup>
          <div className="flex justify-end">
            <Button loading={saving} disabled={saving} type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Tags;
