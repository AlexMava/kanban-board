import { useState, useEffect } from "react";
import { Container, Row, Col } from 'react-bootstrap';
function Footer() {
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <header className="py-4">
            <Container>
                <Row>
                    <Col><p>{`© ${year}. All Rights Reserved.`}</p></Col>
                </Row>
            </Container>
        </header>
    );
}

export default Footer;