const { BackgroundCell } = require("../stories/Background");

describe("SnakeBodyPart", () => {
    it("does something", () => {
        const result = BackgroundCell({ index: 10 });
        expect(result.props.style.top).toEqual(500);
    })
});