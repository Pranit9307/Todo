const axios = require('axios');

async function testApi() {
    const apiUrl = 'http://localhost:8000/api/posts';

    try {
        console.log('--- Setting up data ---');
        // Create 3 posts
        // 1. Completed, Date A
        const p1 = await axios.post(apiUrl, { title: 'P1', body: 'B1', dueDate: '2026-02-01' });
        await axios.put(`${apiUrl}/${p1.data.id}`, { title: 'P1', body: 'B1', completed: true, dueDate: '2026-02-01' });

        // 2. Pending, Date A
        const p2 = await axios.post(apiUrl, { title: 'P2', body: 'B2', dueDate: '2026-02-01' });

        // 3. Pending, Date B
        const p3 = await axios.post(apiUrl, { title: 'P3', body: 'B3', dueDate: '2026-02-05' });

        const ids = [p1.data.id, p2.data.id, p3.data.id];
        console.log('Created IDs:', ids);

        console.log('\n--- Testing Filters ---');

        // Filter Completed
        console.log('Filter: Completed=true');
        const resCompleted = await axios.get(apiUrl, { params: { completed: true } });
        console.log('Count:', resCompleted.data.length);
        console.log('IDs:', resCompleted.data.map(p => p.id));
        if (!resCompleted.data.find(p => p.id === ids[0])) console.error('FAIL: Missing P1');
        if (resCompleted.data.find(p => p.id === ids[1])) console.error('FAIL: Included P2');

        // Filter Pending
        console.log('Filter: Completed=false');
        const resPending = await axios.get(apiUrl, { params: { completed: false } });
        console.log('Count:', resPending.data.length);
        console.log('IDs:', resPending.data.map(p => p.id));
        if (resPending.data.find(p => p.id === ids[0])) console.error('FAIL: Included P1');
        if (!resPending.data.find(p => p.id === ids[1])) console.error('FAIL: Missing P2');

        // Filter Due Date
        console.log('Filter: DueDate=2026-02-01');
        const resDate = await axios.get(apiUrl, { params: { dueDate: '2026-02-01' } });
        console.log('Count:', resDate.data.length);
        console.log('IDs:', resDate.data.map(p => p.id));
        if (!resDate.data.find(p => p.id === ids[0])) console.error('FAIL: Missing P1');
        if (!resDate.data.find(p => p.id === ids[1])) console.error('FAIL: Missing P2');
        if (resDate.data.find(p => p.id === ids[2])) console.error('FAIL: Included P3');

        console.log('\n--- Cleanup ---');
        for (const id of ids) {
            await axios.delete(`${apiUrl}/${id}`);
        }
        console.log('Cleanup done.');

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testApi();
