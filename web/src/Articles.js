import React, { Component } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'

import axios from 'axios'

class Articles extends Component {
    constructor(props) {
        super(props)
        this.state = {
            articles: [],
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData() {
        const limit = 100
        axios
            .get(`/api/blogs?limit=${limit}`)
            .then((resp) => {
                let uuids = resp.data.uuids || []
                return Promise.all(
                    uuids.map((uuid) =>
                        axios
                            .get(`/api/blogs/${uuid}`)
                            .then((resp) => resp.data)
                    )
                )
            })
            .then((articles) => {
                this.setState({ articles })
            })
            .catch((e) => {
                console.log(e)
            })
    }

    onNewArticle(event) {
        event.preventDefault()
        axios.post('/api/blogs').then((resp) => {
            const { uuid } = resp.data
            console.log('New Post uuid', uuid)
            this.props.history.push(`/edit/${uuid}`)
        })
    }

    onFollow(event) {
        event.preventDefault()
        console.log('clicked on follow')
    }

    onUnfollow(event) {
        event.preventDefault()
        console.log('clicked on unfollow')
    }

    render() {
        return (
            <Container style={{ marginTop: 20 }} fluid="md">
                <div style={{ display: 'flex', margin: 20 }}>
                    <h4 className="ml-2">All Articles</h4>
                    <Button
                        onClick={this.onNewArticle.bind(this)}
                        style={{ marginLeft: 'auto' }}
                    >
                        New
                    </Button>
                </div>
                {this.state.articles.length == 0 && (
                    <Alert variant="primary">We got nothing here.</Alert>
                )}
                <ListGroup>
                    {this.state.articles.map((article) => (
                        <ListGroup.Item
                            as="div"
                            key={article.uuid}
                            style={{ border: 0 }}
                        >
                            <Card border="primary" style={{ width: '100%' }}>
                                <Card.Body>
                                    <Card.Title>{article.title}</Card.Title>
                                    <hr align="center" />
                                    <Card.Text
                                        dangerouslySetInnerHTML={{
                                            __html: article.rendered,
                                        }}
                                    ></Card.Text>
                                </Card.Body>
                                <Card.Footer
                                    className="text-muted"
                                    style={{ display: 'flex' }}
                                    variant="primary"
                                >
                                    <div>
                                        By{' '}
                                        {article.author == this.props.uuid &&
                                            article.authorName}
                                        {article.author != this.props.uuid && (
                                            <Link
                                                to={`/user/${article.author}`}
                                            >
                                                {article.authorName}
                                            </Link>
                                        )}{' '}
                                        on{' '}
                                        {new Date(
                                            article.updated * 1000
                                        ).toLocaleDateString('en-US')}
                                    </div>
                                    {article.author == this.props.uuid && (
                                        <div style={{ marginLeft: 'auto' }}>
                                            <Link to={`/edit/${article.uuid}`}>
                                                Edit
                                            </Link>
                                        </div>
                                    )}
                                    {article.author != this.props.uuid && (
                                        <div style={{ marginLeft: 'auto' }}>
                                            <a
                                                onClick={this.onFollow.bind(
                                                    this
                                                )}
                                                style={{ marginLeft: 'auto' }}
                                                className="active"
                                            >
                                                Follow
                                            </a>
                                        </div>
                                    )}
                                </Card.Footer>
                            </Card>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Container>
        )
    }
}

export default Articles
