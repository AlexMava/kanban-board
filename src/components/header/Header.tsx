import { Container, Row, Col } from 'react-bootstrap';

function Header() {
    return (
        <header className="py-4">
            <Container>
                <Row>
                    <Col>
                        <form>
                            <input type="text" className="" id="" placeholder="Enter Repo URL"/>

                            <button type="submit" className="btn btn-primary">Load issues</button>
                        </form>
                    </Col>
                </Row>
            </Container>
        </header>
    );
}

export default Header;