{% extends "base.html" %}
{% block gamemode %}
<script src="{{ url_for('static',filename='/scripts/auto-complete.js') }}"></script>
<script src="{{ url_for('static',filename='/scripts/spy-mode.js') }}"></script>
<div class="flex flex-col justify-center items-center gap-y-[10px]">
    <div class="flex flex-col items-center mt-[20px] h-auto w-[300px] rounded-lg" style="background-color: rgba(39, 52, 63, 0.8); border: 3px solid rgb(120, 120, 120); box-sizing: border-box;">
        <div class="flex flex-col items-center text-white p-[15px] text-center font-bold mt-[15px]">
        Which character does this splash art belong to?
        <!-- Placeholder for the splash image -->
        <div id="splash-icon" class="h-[192px] w-[192px] bg-no-repeat bg-center bg-cover" style="image-rendering: pixelated;"></div>
        </div>
        <span id="clue_countdown" class="text-white text-xs font-bold pb-[25px]">Clues in 5 tries</span>
        <span id="name_clue" class="hidden text-white font-bold pb-[25px]"></span>
    </div>
    <span id="show_character_data"></span>
    
    <form autocomplete="off" class="flex w-[300px] items-center relative inline-block" id="guess-form">
        <div class="autocomplete w-[300px]">
            <input id="guess" style="background-image: url(&quot;/static/images/input.png&quot;); background-size: 300px 58px;" class="bg-transparent bg-no-repeat outline-none text-white w-[300px] pl-[25px] p-[18px]" type="text" name="guess-character" placeholder="Character">
        </div>
        <input id="submit" value='' style="background-image: url(&quot;/static/images/buttons/submit_button.png&quot;); background-size: 40px 40px;" class="absolute hover:brightness-110 right-[10px] bg-no-repeat bg-center bg-transparent aspect-[1] h-[40px] ml-[10px] cursor-pointer" type="submit">
    </form>
    <div id="results"></div>
    
    <div id="congrats_message" class="hidden flex flex-col items-center text-white bg-green-800 border-4 border-green-600 p-6 mt-4 rounded-lg">
        <div class="font-bold text-3xl text-center">Congrats!</div>
        <div id="tried-text" class="text-lg text-center">"You guessed it in 1 try!"</div>
        <div class="font-bold text-xl text-center mt-4">Next Mode</div>
        <div class="bg-no-repeat hover:scale-button cursor-pointer bg-center aspect-[173/50] w-[173px]" onclick="location.href='/spy'" style="background-image: url(&quot;/static/images/buttons/spy_button_short.png&quot;); background-size: 173px 50px;"></div>
        
        <div class="font-bold text-xl text-center mt-4">Other Modes</div>
        <div class="flex gap-4 justify-center mt-2">
            <div class="gamemode-button bg-no-repeat w-[50px] h-[50px] cursor-pointer hover:scale-button" onclick="location.href='/classic'" style="background-image: url(&quot;/static/images/buttons/classic_1.png&quot;); background-size: 50px 50px;">
                <span class="gamemode-label">Classic Mode</span>
            </div>
            <div class="gamemode-button bg-no-repeat w-[50px] h-[50px] cursor-pointer hover:scale-button" onclick="location.href='/voiceline'" style="background-image: url(&quot;/static/images/buttons/voiceline_1.png&quot;); background-size: 50px 50px;">
                <span class="gamemode-label">Voiceline Mode</span>
            </div>
            <div class="gamemode-button bg-no-repeat w-[50px] h-[50px] cursor-pointer hover:scale-button" onclick="location.href='/spy'" style="background-image: url(&quot;/static/images/buttons/spy_1.png&quot;); background-size: 50px 50px;">
                <span class="gamemode-label">Spy Mode</span>
            </div>
        </div>
    </div>
</div>

{% endblock %}
