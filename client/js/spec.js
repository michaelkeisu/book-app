describe('Hello world', function() {
	it('should increment a value by one', function() {

		expect(add(1)).toBe(2);

		function add(value) {
			return value + 1;
		}

	}); 

	it('should decrement a value by one', function() {
		expect(subtract(5)).toBe(4);


		function subtract(value) {
			return value - 1;
		}

	})
}); 