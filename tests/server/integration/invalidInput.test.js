/**
 * @jest-environment node
 */

const { TestServer, TestClient } = require('./serverHelper')

var server = null

const MOCK_USER = {
    uuid: 1234,
    email: 'jdoe@example.com',
    name: 'John Doe',
    notificationPreference: '',
}

beforeEach(async (done) => {
    server = new TestServer(MOCK_USER)
    await server.launch()
    done()
})

describe('invalid input tests', () => {
    test('nonexistent API', async () => {
        var client = new TestClient()

        await client.get('/api/foo/bar').then((response) => {
            expect(response.status).toBe(404)
        })
    })

    test('nonexistent path', async () => {
        var client = new TestClient()

        await client.get('/foo/bar').then((response) => {
            expect(response.status).toBe(404)
        })
    })

    test('invalid GET /api/blogs limit 101', async () => {
        var client = new TestClient()

        await client.get('/api/blogs?query=101').then((response) => {
            expect(response.status).toBe(400)
        })
    })

    test('invalid GET /api/blogs limit 0', async () => {
        var client = new TestClient()

        await client.get('/api/blogs?query=0').then((response) => {
            expect(response.status).toBe(400)
        })
    })
})

afterEach(async (done) => {
    await server.close()
    server = null
    done()
})
