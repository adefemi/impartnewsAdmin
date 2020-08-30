import React, { useState, useEffect } from "react";
import Input from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import TransactionTable from "../../components/transactionTable/transactionTable";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination/pagination";
import { Modal } from "../../components/modal/Modal";
import { getMarketting, deleteMarketting } from "../requests";
import { Notification } from "../../components/notification/Notification";

function Markettings(props) {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  // const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(1);

  useEffect(() => {
    getBLogs();
  }, [currentPage]);

  const getBLogs = async () => {
    setLoading(true);
    let blogs = await getMarketting();
    if (blogs) {
      setTotal(blogs.count);
      setBlogs(blogs.results);
    }
    setLoading(false);
  };

  const onDeleteBlog = (slug) => {
    Modal.confirm({
      title: "Delete Confirmation",
      content: "Do you really want to delete this content?",
      onOK: async () => {
        await deleteMarketting(slug);
        Notification.bubble({
          type: "success",
          content: "Content successfully deleted",
        });
        getBLogs();
      },
    });
  };

  const getBlogValue = () => {
    const res = [];

    blogs.map((item) => {
      res.push([
        <div style={{ maxWidth: 50 }}>{item.id}</div>,
        <div style={{ minWidth: 200 }}>
          <Link to={`/marketting/edit/${item.id}`}>{item.caption}</Link>
        </div>,
        <div style={{ minWidth: 200 }}>{item.link}</div>,
        <div style={{ maxWidth: 150 }} className="flex align-center">
          <Button
            onClick={() => props.history.push(`/marketting/edit/${item.id}`)}
          >
            Edit
          </Button>
          &nbsp;&nbsp;
          <Button color="danger" onClick={() => onDeleteBlog(item.id)}>
            Delete
          </Button>
        </div>,
      ]);
      return null;
    });
    return res;
  };
  return (
    <div>
      <h3>All Markettings</h3>
      <div className="flex align-center justify-between">
        {/* <Input
          debounce
          placeholder="search blogs"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          style={{ maxWidth: "300px" }}
        /> */}
        <div />
        <Link to="/marketting/new">
          <Button>ADD MARKETTING</Button>
        </Link>
      </div>
      <br />
      <TransactionTable
        loading={loading}
        keys={["Id", "Item", "Link", "Actions"]}
        values={getBlogValue()}
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
    </div>
  );
}

export default Markettings;
