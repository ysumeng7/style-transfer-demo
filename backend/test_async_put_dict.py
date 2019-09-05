import asyncio


async def wait():
	x = 0
	while x < 4:
		await asyncio.sleep(1)
		print(x)
		x += 1
	return '[done]'


x = asyncio.run(wait())
print(x)