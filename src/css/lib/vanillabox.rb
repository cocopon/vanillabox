module Sass::Script::Functions
	def high_res(url, ratio)
		assert_type url, :String, :url
		assert_type ratio, :Number, :ratio
 
		str = url.value
		index = str.rindex('.')
		if index == nil
			index = str.length()
		end

		high_res_str = str.insert(index, "@#{ratio.value}x")
		return Sass::Script::String.new(high_res_str, :String)
	end
	declare :high_res, [:url, :ratio]
end
