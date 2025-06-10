import React, { useEffect, useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import {
    fetchOrderAnalytics,
    exportOrders,
    fetchNoOrderPeriods,
    fetchPeakOrderPeriod,
} from "../http/deviceAPI";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Analytics = observer(() => {
    const [period, setPeriod] = useState("month");
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Количество заказов",
                data: [],
                backgroundColor: ["#007bff", "#dc3545", "#28a745", "#ffc107"],
                borderColor: ["#0056b3", "#a71d2a", "#1f7a44", "#cc8e0c"],
                borderWidth: 1,
            },
        ],
    });
    const [noOrderPeriods, setNoOrderPeriods] = useState([]);
    const [peakPeriod, setPeakPeriod] = useState({ period: null, count: 0 });

    useEffect(() => {
        fetchOrderAnalytics(period)
            .then((data) => {
                setChartData({
                    labels: data.labels,
                    datasets: [
                        {
                            label: "Количество заказов",
                            data: data.data,
                            backgroundColor: ["#007bff", "#dc3545", "#28a745", "#ffc107"],
                            borderColor: ["#0056b3", "#a71d2a", "#1f7a44", "#cc8e0c"],
                            borderWidth: 1,
                        },
                    ],
                });
            })
            .catch((e) => {
                console.error("Error fetching analytics:", e);
            });

        fetchNoOrderPeriods(period)
            .then((data) => setNoOrderPeriods(data.periods))
            .catch((e) => {
                console.error("Error fetching no order periods:", e);
            });

        fetchPeakOrderPeriod(period)
            .then((data) => setPeakPeriod(data))
            .catch((e) => {
                console.error("Error fetching peak period:", e);
            });
    }, [period]);

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Количество заказов",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Период",
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
        },
    };

    const handleExport = async () => {
        try {
            const data = await exportOrders();
            const blob = new Blob([data], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "orders.csv";
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            alert("Ошибка при экспорте: " + (e.response?.data?.message || "Неизвестная ошибка"));
        }
    };

    return (
        <Container className="mt-5">
            <h2>Аналитика заказов</h2>
            <Form.Group className="mb-3">
                <Form.Label>Период:</Form.Label>
                <Form.Select onChange={(e) => setPeriod(e.target.value)}>
                    <option value="month">По месяцам</option>
                    <option value="quarter">По кварталам</option>
                </Form.Select>
            </Form.Group>
            <Button variant="outline-primary" onClick={handleExport} className="mb-3">
                Экспорт в CSV
            </Button>
            <div style={{ height: "400px" }}>
                <Bar data={chartData} options={chartOptions} />
            </div>
            <Card className="mt-4">
                <Card.Body>
                    <Card.Title>Дополнительная аналитика</Card.Title>
                    <Card.Text>
                        <strong>Период с наибольшим количеством заказов:</strong>{" "}
                        {peakPeriod.period || "Нет данных"} ({peakPeriod.count} заказов)
                    </Card.Text>
                    <Card.Text>
                        <strong>Периоды без заказов:</strong>{" "}
                        {noOrderPeriods.length > 0
                            ? noOrderPeriods.join(", ")
                            : "Нет таких периодов"}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    );
});

export default Analytics;
