import React from 'react';
import axios from 'axios';
import '../App.css';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        'background-color': 'antiquewhite'
    }
};

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            blogs: [],
            addModal: false,
            blogAddText: ''
        }
    }

    componentDidMount() {
        axios("http://localhost:8082/blog/getblogs")
            .then(res => this.setState({ blogs: res.data.blog }))
            .catch(err => console.log(err))
    }

    handleDetails = (event) => {
        this.props.history.push(`/details/${event.target.id}`)
    }

    handleDelete = (event) => {
        axios({
            method: "DELETE",
            url: `http://localhost:8082/blog/deleteblog/${event.target.id}`,
            headers: { 'Content-Type': 'application/json' }
        }).then(response => axios("http://localhost:8082/blog/getblogs")
            .then(res => this.setState({ blogs: res.data.blog }))
            .catch(err => console.log(err)))
            .catch(err => console.log(err))
    }

    handleAdd = () => {
        this.setState({ addModal: true })
    }

    handleChangeAddBlog = (event) => {
        this.setState({ blogAddText: event.target.value });
    }

    handleAddBlog = () => {
        const { blogAddText } = this.state;
        const addObj = {
            "blogMessage": blogAddText
        };
        axios({
            method: 'POST',
            url: `http://localhost:8082/blog/addblog`,
            headers: { 'Content-Type': 'application/json' },
            data: addObj
        }).then(response => axios("http://localhost:8082/blog/getblogs")
            .then(res => this.setState({ blogs: res.data.blog, addModal: false }))
            .catch(err => console.log(err)))
            .catch(err => console.log(err))
    }

    render() {
        const { blogs, addModal, blogAddText } = this.state;
        return (
            <div>
                <table className="table table-bordered table-hover table-striped">
                    <tbody>
                        <tr>
                            <td className="table-data" colSpan="4">Blogs</td>
                        </tr>
                        <tr className="table-header">
                            <td>S.NO</td>
                            <td>Blogs</td>
                            <td>Details</td>
                            <td>Actions</td>
                        </tr>
                        {blogs.map((item, index) => {
                            return <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.blogMessage}</td>
                                <td><button id={item._id} className="btn btn-warning" onClick={this.handleDetails}>Details</button></td>
                                <td><button className="btn btn-primary btn-margin">Update</button>
                                    <button id={item._id} className="btn btn-danger" onClick={this.handleDelete}>Delete</button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                <button className="btn btn-success" onClick={this.handleAdd}>Add Blog</button>
                <Modal
                    isOpen={addModal}
                    style={customStyles}
                >
                    <div>
                        <div className="modal-header">Add Blog</div>
                        <label>Blog : </label>
                        <input type="text" value={blogAddText} onChange={this.handleChangeAddBlog}></input>
                        <button className="btn btn-success" onClick={this.handleAddBlog}>Add</button>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Home;